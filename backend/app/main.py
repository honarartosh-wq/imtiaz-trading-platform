from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.api import auth
# Import other routers as we create them
# from app.api import accounts, transactions, trades

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Imtiaz Trading Platform with MetaTrader Integration",
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
# app.include_router(accounts.router, prefix="/api")
# app.include_router(transactions.router, prefix="/api")
# app.include_router(trades.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Imtiaz Trading Platform API",
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/init-database")
async def initialize_database():
    """One-time database initialization endpoint. Remove after use."""
    try:
        from app.init_db import init_db
        init_db()
        return {
            "status": "success",
            "message": "Database initialized with demo data",
            "warning": "Remove this endpoint after initialization"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
