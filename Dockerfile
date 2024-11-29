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

# Install curl and netcat for healthcheck and debugging
RUN apt-get update && apt-get install -y curl netcat-traditional && rm -rf /var/lib/apt/lists/*

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

# Add a script to check if the service is ready
COPY --chown=appuser:appuser <<EOF /app/healthcheck.sh
#!/bin/bash
curl --fail http://localhost:\${PORT}/health || exit 1
EOF
RUN chmod +x /app/healthcheck.sh

# Health check with increased timeout and start period
HEALTHCHECK --interval=5s --timeout=10s --start-period=30s --retries=3 \
    CMD /app/healthcheck.sh

# Expose the port
EXPOSE 8000

# Start the application with explicit port
ENV PORT=8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --log-level debug