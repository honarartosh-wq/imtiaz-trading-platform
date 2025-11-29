from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.config import settings
from app.database import Base, engine
from app.api import auth, manager
from app.utils.logging import setup_logging, get_logger
# Import other routers as we create them
# from app.api import accounts, transactions, trades

# Setup logging
setup_logging(log_level="INFO" if not settings.DEBUG else "DEBUG")
logger = get_logger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Imtiaz Trading Platform with MetaTrader Integration",
    debug=settings.DEBUG
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(manager.router, prefix="/api")
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
