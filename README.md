# Dev Diligence

A code review and analysis tool powered by AI.

## Deployment

### Backend (FastAPI)
1. Set up environment variables in Railway:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_API_MODEL`: The OpenAI model to use (e.g., gpt-4)
   - `CORS_ORIGINS`: Frontend URL (e.g., https://your-frontend-url.railway.app)

2. Deploy backend:
   - Railway will automatically detect the Python project and use the Procfile
   - Make sure to set the environment variables in Railway dashboard

### Frontend (Next.js)
1. Set up environment variables in Railway:
   - `NEXT_PUBLIC_API_URL`: Backend API URL

2. Deploy frontend:
   - Railway will automatically detect the Next.js project
   - Build command: `npm run build`
   - Start command: `npm start`

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd dev-diligence
   npm install
   ```
3. Set up environment variables
4. Run the development servers:
   ```bash
   # Backend
   cd backend
   uvicorn main:app --reload

   # Frontend
   cd dev-diligence
   npm run dev
   ``` 