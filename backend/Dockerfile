FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl tzdata && \
    rm -rf /var/lib/apt/lists/*

# Set timezone to UTC
ENV TZ=UTC

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create static directory for API docs
RUN mkdir -p /app/static

# Set permissions
RUN chown -R appuser:appuser /app
USER appuser

# Start the application with production settings
CMD ["python", "-c", "import os; port = int(os.getenv('PORT', '8000')); import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=port, workers=1, timeout_keep_alive=75)"] 