from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from openai import OpenAI
from utils.schemas import CODE_ANALYSIS_SCHEMA
from utils.templates import get_root_html
import os
import json

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
os.makedirs("static", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Get CORS origins from environment variable
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key and model from environment variables
openai_model = os.getenv("OPENAI_API_MODEL")

# Validate API key and model are loaded
if not openai_model:
    raise ValueError("No OpenAI model specified. Please check your .env file.")

@app.get("/")
async def root():
    # Add debug logging
    print("Serving root route")
    try:
        if not os.path.exists("static/index.html"):
            print("Error: static/index.html not found")
            print("Contents of static directory:", os.listdir("static"))
            return JSONResponse(
                content={"error": "Frontend files not found"},
                status_code=500
            )
        return FileResponse("static/index.html")
    except Exception as e:
        print(f"Error serving index.html: {str(e)}")
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

@app.get("/api-docs", response_class=HTMLResponse)
async def api_docs():
    return get_root_html()

@app.post("/analyze-code/")
async def analyze_code(
    file: UploadFile = File(default=None),
    code: str = Form(default=None)
):
    print("\n=== New Code Analysis Request ===")
    print("Request type:", "FILE" if file else "CODE" if code else "NONE")
    
    if file:
        print(f"File details:")
        print(f"- Filename: {file.filename}")
        print(f"- Content type: {file.content_type}")
        print(f"- File size: {len(await file.read())} bytes")
        await file.seek(0)  # Reset file pointer after reading
    
    if code:
        print("Code details:")
        print(f"- Length: {len(code)} characters")
        print(f"- Preview: {code[:100]}...")
    
    try:
        # Get code content
        if file:
            try:
                code_content = (await file.read()).decode('utf-8')
                print("✓ Successfully read file content")
            except UnicodeDecodeError:
                print("✗ Error: File is not a valid text file")
                raise HTTPException(status_code=400, detail="File must be a text file")
        elif code:
            code_content = code
            print("✓ Using direct code input")
        else:
            print("✗ Error: No code provided")
            raise HTTPException(status_code=400, detail="No code provided")

        # Validate OpenAI settings
        if not openai_model:
            print("✗ Error: OpenAI model not configured")
            raise HTTPException(status_code=500, detail="OpenAI model not configured")

        print(f"✓ Using OpenAI model: {openai_model}")

        try:
            # Create system message with instructions
            system_message = """You are a code review assistant. Analyze the provided code and return a detailed review in JSON format.
            Focus on code quality, performance, and provide actionable suggestions. Score each aspect out of 10.
            Your response must strictly follow the specified JSON schema."""

            # Make OpenAI API call
            print(f"Making API call with model: {openai_model}")
            response = client.chat.completions.create(
                model=openai_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": f"Please analyze this code:\n\n{code_content}"}
                ],
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "code_analysis_schema",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "overall_score": {
                                    "type": "number",
                                    "description": "Overall code quality score out of 10"
                                },
                                "code_quality": {
                                    "type": "number",
                                    "description": "Code readability and maintainability score out of 10"
                                },
                                "performance": {
                                    "type": "number",
                                    "description": "Code performance and efficiency score out of 10"
                                },
                                "suggestions": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "type": {
                                                "type": "string",
                                                "enum": ["improvement", "warning", "error"]
                                            },
                                            "message": {
                                                "type": "string",
                                                "description": "Detailed suggestion message"
                                            }
                                        },
                                        "required": ["type", "message"]
                                    }
                                },
                                "improved_code": {
                                    "type": "string",
                                    "description": "Suggested improved version of the code"
                                }
                            },
                            "required": ["overall_score", "code_quality", "performance", "suggestions"]
                        }
                    }
                },
                temperature=0.5
            )
            print("API call successful")
        except Exception as e:
            error_msg = str(e)
            if "authentication" in error_msg.lower():
                print(f"Authentication Error: {error_msg}")
                raise HTTPException(status_code=401, detail=error_msg)
            elif "api" in error_msg.lower():
                print(f"API Error: {error_msg}")
                raise HTTPException(status_code=502, detail=error_msg)
            else:
                print(f"Unexpected error: {error_msg}")
                raise HTTPException(status_code=500, detail=error_msg)

        # Parse and validate response
        analysis = json.loads(response.choices[0].message.content)
        
        # Ensure all required fields are present
        required_fields = ["overall_score", "code_quality", "performance", "suggestions"]
        missing_fields = [field for field in required_fields if field not in analysis]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        # Format scores
        for field in ["overall_score", "code_quality", "performance"]:
            analysis[field] = round(float(analysis[field]), 1)

        return JSONResponse(
            content=analysis,
            status_code=200
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    try:
        models = client.models.list()
        return {"available_models": [model.id for model in models]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # First try to serve from static directory
    static_file = f"static/{full_path}"
    if os.path.exists(static_file):
        return FileResponse(static_file)
    # If file not found, serve index.html for client-side routing
    return FileResponse("static/index.html") 