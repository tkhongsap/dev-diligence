# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --no-lint

# Build backend
FROM python:3.11-slim
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Create static directory
RUN mkdir -p /app/static/_next

# Copy built frontend files to backend static directory
COPY --from=frontend-builder /app/frontend/out /app/static
COPY --from=frontend-builder /app/frontend/.next/static /app/static/_next/static

# Set permissions
RUN chown -R appuser:appuser /app
RUN chmod -R 755 /app/static

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 8000

# Start the application
ENV PORT=8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --log-level debug