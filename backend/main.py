from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create FastAPI app
app = FastAPI(
    title="Imtiaz Trading Platform API",
    version="1.0.0",
    description="Trading Platform Backend API"
)

# Configure CORS - allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Imtiaz Trading Platform API",
        "version": "1.0.0",
        "status": "running",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "local")
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Railway."""
    return {
        "status": "healthy",
        "service": "backend-api"
    }


@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify API is working."""
    return {
        "success": True,
        "message": "API is working correctly!"
    }
