FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create static directory first
RUN mkdir -p static

# Copy application files
COPY . .

# Ensure static directory exists and has proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Make port configurable but default to 8000
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the application
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]