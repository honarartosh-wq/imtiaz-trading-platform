# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .

# Expose port (Railway will use $PORT)
EXPOSE 8000

# Run the application - use shell form to allow $PORT variable expansion
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
