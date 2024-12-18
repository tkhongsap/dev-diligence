from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from openai import OpenAI
from utils.templates import get_root_html
import os
import json
import httpx
import logging
from pydantic import BaseModel
from typing import List, Literal
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prompts.code_review import CODE_REVIEW_PROMPT

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(
    title="Code Review API",
    description="API for analyzing code using OpenAI",
    version="1.0.0",
)

# Create static directory if it doesn't exist
static_dir = "static"
os.makedirs(os.path.join(static_dir, "_next/static"), exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=static_dir), name="static")
try:
    app.mount("/_next/static", StaticFiles(directory=os.path.join(static_dir, "_next/static")), name="next-static")
except RuntimeError as e:
    logger.warning(f"Static files directory not found: {e}")

# Configure CORS
is_production = os.getenv("RAILWAY_ENVIRONMENT") == "production"
default_cors = "https://dev-diligence-production.up.railway.app" if is_production else "http://localhost:3000"
CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", default_cors).split(",")]

logger.info(f"CORS Origins configured: {CORS_ORIGINS}")
logger.info(f"Production mode: {is_production}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key and model from environment variables
openai_model = os.getenv("OPENAI_API_MODEL")

# Validate API key and model are loaded
if not openai_model:
    raise ValueError("No OpenAI model specified. Please check your .env file.")

# Get port from environment or default to 8000 to match Dockerfile
port = int(os.getenv("PORT", 8000))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the structure for suggestions
class Suggestion(BaseModel):
    type: Literal["improvement", "warning", "error"]
    category: Literal["overall", "correctness", "quality", "performance", "security", 
                     "consistency", "scalability", "error_handling"]
    message: str

# Define the structure for code analysis
class CodeAnalysis(BaseModel):
    overall_score: float
    correctness_functionality: float
    code_quality_maintainability: float
    performance_efficiency: float
    security_vulnerability: float
    code_consistency_style: float
    scalability_extensibility: float
    error_handling_robustness: float
    suggestions: List[Suggestion]
    dimension_explanations: dict | None = None
    improvement_summary: dict | None = None

# Add trusted hosts middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # In production, you might want to restrict this
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting application...")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Environment PORT: {os.getenv('PORT')}")
    logger.info(f"Static directory exists: {os.path.exists(static_dir)}")
    logger.info(f"CORS origins: {CORS_ORIGINS}")
    
    # Verify OpenAI API key
    try:
        models = client.models.list()
        logger.info("✓ OpenAI API key verified successfully")
    except Exception as e:
        logger.error(f"✗ OpenAI API key verification failed: {str(e)}")

@app.get("/health")
async def health_check():
    try:
        # Check if OpenAI client is configured
        if not client.api_key:
            return JSONResponse(
                status_code=503,
                content={"status": "unhealthy", "detail": "OpenAI API key not configured"}
            )
        
        # Verify static directory exists
        if not os.path.exists(static_dir):
            return JSONResponse(
                status_code=503,
                content={"status": "unhealthy", "detail": "Static directory not found"}
            )
            
        logger.info("Health check passed")
        return {"status": "healthy", "version": "1.0.0"}
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "detail": str(e)}
        )

@app.get("/api-docs", response_class=HTMLResponse)
async def api_docs():
    return get_root_html()

@app.get("/models")
async def list_models():
    try:
        models = client.models.list()
        model_list = [model.id for model in models]
        logger.info(f"Available models: {model_list}")
        return {"available_models": model_list}
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-code/")
async def analyze_code(
    request: Request,
    file: UploadFile = File(default=None),
    code: str = Form(default=None)
):
    logger.info("Received analyze-code request")
    logger.info(f"Request headers: {request.headers}")
    logger.info(f"Request origin: {request.headers.get('origin')}")
    logger.info(f"CORS_ORIGINS: {CORS_ORIGINS}")
    
    try:
        # Get code content
        if file:
            code_content = (await file.read()).decode('utf-8')
            logger.info("Successfully read file content")
        elif code:
            code_content = code
            logger.info("Using direct code input")
        else:
            raise HTTPException(status_code=400, detail="No code provided")

        # Make OpenAI API call
        try:
            system_message = CODE_REVIEW_PROMPT

            response = client.chat.completions.create(
                model=openai_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": f"Review this code:\n\n{code_content}"}
                ],
                temperature=0.3
            )
            
            # Parse the response
            try:
                analysis = json.loads(response.choices[0].message.content)
                logger.info("Successfully parsed response")
                
                # Validate response structure
                required_fields = [
                    "overall_score", "correctness_functionality", "code_quality_maintainability", 
                    "performance_efficiency", "security_vulnerability", "code_consistency_style", 
                    "scalability_extensibility", "error_handling_robustness", "suggestions"
                ]
                for field in required_fields:
                    if field not in analysis:
                        raise ValueError(f"Missing required field: {field}")
                
                # Round numeric scores
                for key in [
                    "overall_score", "correctness_functionality", "code_quality_maintainability", 
                    "performance_efficiency", "security_vulnerability", "code_consistency_style", 
                    "scalability_extensibility", "error_handling_robustness"
                ]:
                    analysis[key] = round(float(analysis[key]), 1)
                
                # Set default values for optional fields if they don't exist
                if "dimension_explanations" not in analysis:
                    analysis["dimension_explanations"] = None
                if "improvement_summary" not in analysis:
                    analysis["improvement_summary"] = None
                
                # Add this validation in the analyze_code function after parsing the response
                if "dimension_explanations" in analysis:
                    for key, explanation in analysis["dimension_explanations"].items():
                        if key in analysis and "score" in explanation:
                            if abs(explanation["score"] - analysis[key]) > 0.01:  # Allow for small floating-point differences
                                logger.warning(f"Score mismatch in {key}: {explanation['score']} != {analysis[key]}")
                                explanation["score"] = analysis[key]  # Force consistency
                
                return JSONResponse(content=analysis, status_code=200)
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                logger.error(f"Raw response: {response.choices[0].message.content}")
                raise HTTPException(status_code=500, detail="Invalid response format from AI model")
            
        except Exception as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(api_error)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    try:
        # Serve index.html directly
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        else:
            return HTMLResponse(content="<h1>Dev Diligence API</h1><p>API is running.</p>")
    except Exception as e:
        logger.error(f"Error serving root route: {str(e)}")
        return HTMLResponse(content="<h1>Error</h1><p>Internal server error</p>", status_code=500)

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Don't handle API routes
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not Found")
        
    try:
        logger.info(f"Serving path: {full_path}")
        # First try to serve from static directory
        static_file = os.path.join(static_dir, full_path)
        if os.path.exists(static_file) and os.path.isfile(static_file):
            logger.info(f"Serving static file: {static_file}")
            return FileResponse(static_file)
        
        # If file not found, serve index.html for client-side routing
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            logger.info("Falling back to index.html")
            return FileResponse(index_path)
        
        # If even index.html is not found, return a simple response
        return HTMLResponse(content="<h1>Dev Diligence API</h1><p>API is running.</p>")
    except Exception as e:
        logger.error(f"Error serving path {full_path}: {str(e)}")
        return HTMLResponse(content="<h1>Error</h1><p>Internal server error</p>", status_code=500)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)