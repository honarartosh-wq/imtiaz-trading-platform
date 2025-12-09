import logging
import time
from functools import wraps
from typing import Callable
import psutil
import os

logger = logging.getLogger(__name__)


def monitor_performance(func: Callable) -> Callable:
    """Decorator to monitor function performance."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            if execution_time > 1.0:  # Log slow operations
                logger.warning(
                    f"Slow operation: {func.__name__} took {execution_time:.2f}s",
                    extra={
                        'function': func.__name__,
                        'execution_time': execution_time,
                        'slow_operation': True
                    }
                )
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(
                f"Error in {func.__name__}: {str(e)}",
                extra={
                    'function': func.__name__,
                    'execution_time': execution_time,
                    'error': str(e)
                }
            )
            raise
    return wrapper


def get_system_metrics():
    """Get current system metrics."""
    return {
        'cpu_percent': psutil.cpu_percent(interval=1),
        'memory_percent': psutil.virtual_memory().percent,
        'disk_percent': psutil.disk_usage('/').percent,
        'process_count': len(psutil.pids()),
    }
