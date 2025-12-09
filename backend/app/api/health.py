from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
import psutil
from app.database import get_db
from app.utils.monitoring import get_system_metrics

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "imtiaz-trading-platform",
    }


@router.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with database and system metrics."""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "imtiaz-trading-platform",
        "checks": {}
    }
    
    # Check database
    try:
        db.execute("SELECT 1")
        health_status["checks"]["database"] = {
            "status": "healthy",
            "latency_ms": 0  # Could measure actual latency
        }
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    # System metrics
    try:
        metrics = get_system_metrics()
        health_status["checks"]["system"] = {
            "status": "healthy",
            "metrics": metrics
        }
        
        # Alert if resources are critical
        if metrics['cpu_percent'] > 90 or metrics['memory_percent'] > 90:
            health_status["status"] = "degraded"
            health_status["checks"]["system"]["warning"] = "High resource usage"
            
    except Exception as e:
        health_status["checks"]["system"] = {
            "status": "unknown",
            "error": str(e)
        }
    
    return health_status


@router.get("/health/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """Kubernetes readiness probe."""
    try:
        db.execute("SELECT 1")
        return {"status": "ready"}
    except Exception:
        return {"status": "not_ready"}, status.HTTP_503_SERVICE_UNAVAILABLE


@router.get("/health/live")
async def liveness_check():
    """Kubernetes liveness probe."""
    return {"status": "alive"}
