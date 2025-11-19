#!/bin/bash

# Start script for Imtiaz Trading Platform Backend

echo "🚀 Starting Imtiaz Trading Platform Backend..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: python -m venv venv"
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running again."
    exit 1
fi

# Check if database is initialized
echo "🔍 Checking database..."
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database ready"
else
    echo "❌ Database error. Please check your DATABASE_URL in .env"
    exit 1
fi

# Start the server
echo ""
echo "🌐 Starting FastAPI server on http://0.0.0.0:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
