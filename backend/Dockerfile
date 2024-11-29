FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create static directory with proper permissions
RUN mkdir -p static && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Use environment variable for port with fallback to 8000
ENV PORT=8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]