# Dev Diligence

A code review and analysis tool powered by AI.

## Development with Docker

1. Clone the repository
2. Copy environment files:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp dev-diligence/.env.example dev-diligence/.env
   ```

3. Set up your environment variables in the .env files

4. Start the development servers:
   ```bash
   docker compose up
   ```

   The services will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

5. For development:
   - Backend code changes will auto-reload
   - Frontend code changes will trigger hot-reload
   - Logs from both services will be visible in the terminal