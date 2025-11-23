from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from supabase import Client
import os

from config import settings
from database import get_db, get_supabase, engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Trading Platform Backend API with Supabase Integration",
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


@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "message": "Imtiaz Trading Platform API",
        "version": settings.APP_VERSION,
        "status": "running",
        "database": "Supabase PostgreSQL",
        "environment": os.getenv("RAILWAY_ENVIRONMENT", os.getenv("RENDER", "local"))
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint - verifies database connection."""
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "service": "backend-api",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")


@app.get("/api/test")
async def test_endpoint():
    """Test endpoint to verify API is working."""
    return {
        "success": True,
        "message": "API is working correctly with Supabase!"
    }


@app.get("/api/supabase-test")
async def supabase_test(supabase: Client = Depends(get_supabase)):
    """Test Supabase connection."""
    try:
        # Test Supabase connection by querying user count
        response = supabase.table('liquidity_providers').select('id', count='exact').limit(0).execute()
        return {
            "success": True,
            "message": "Supabase connection successful",
            "tables_accessible": True
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Supabase connection failed: {str(e)}"
        }


# =====================================================
# LIQUIDITY PROVIDERS ENDPOINTS
# =====================================================

@app.get("/api/lps")
async def get_liquidity_providers(supabase: Client = Depends(get_supabase)):
    """Get all liquidity providers for the authenticated user."""
    try:
        response = supabase.table('liquidity_providers').select('*').execute()
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/lps")
async def create_liquidity_provider(
    lp_data: dict,
    supabase: Client = Depends(get_supabase)
):
    """Create a new liquidity provider."""
    try:
        response = supabase.table('liquidity_providers').insert(lp_data).execute()
        return {
            "success": True,
            "data": response.data[0] if response.data else None,
            "message": "Liquidity provider created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# ACCOUNTS ENDPOINTS
# =====================================================

@app.get("/api/accounts")
async def get_accounts(supabase: Client = Depends(get_supabase)):
    """Get all trading accounts for the authenticated user."""
    try:
        response = supabase.table('accounts').select('*').execute()
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/accounts")
async def create_account(
    account_data: dict,
    supabase: Client = Depends(get_supabase)
):
    """Create a new trading account."""
    try:
        response = supabase.table('accounts').insert(account_data).execute()
        return {
            "success": True,
            "data": response.data[0] if response.data else None,
            "message": "Account created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# TRADES ENDPOINTS
# =====================================================

@app.get("/api/trades")
async def get_trades(supabase: Client = Depends(get_supabase)):
    """Get all trades for the authenticated user."""
    try:
        response = supabase.table('trades').select('*').order('open_time', desc=True).execute()
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# TRANSACTIONS ENDPOINTS
# =====================================================

@app.get("/api/transactions")
async def get_transactions(supabase: Client = Depends(get_supabase)):
    """Get all transactions for the authenticated user."""
    try:
        response = supabase.table('transactions').select('*').order('created_at', desc=True).execute()
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.DEBUG
    )
