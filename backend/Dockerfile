FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create and set permissions for static directory
RUN mkdir -p /app/static && chown -R appuser:appuser /app/static

# Copy application files
COPY . .

# Ensure proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Make port configurable via environment variable
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the application with the correct port
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]