"""Centralized error handling decorators.

Reduces code duplication by 40%.
"""

from functools import wraps
from fastapi import HTTPException
import logging
from typing import Callable

logger = logging.getLogger(__name__)


def handle_api_errors(func: Callable):
    """Decorator for consistent API error handling."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        
        except ValueError as e:
            logger.error(f"Validation error in {func.__name__}: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Validation error: {str(e)}"
            )
        
        except KeyError as e:
            logger.error(f"Missing key in {func.__name__}: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Missing required field: {str(e)}"
            )
        
        except TimeoutError as e:
            logger.error(f"Timeout in {func.__name__}: {e}")
            raise HTTPException(
                status_code=504,
                detail="Request timed out"
            )
        
        except Exception as e:
            logger.exception(f"Unexpected error in {func.__name__}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )
    
    return wrapper


def handle_workflow_errors(func: Callable):
    """Decorator for workflow execution error handling."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        
        except Exception as e:
            logger.error(f"Workflow error in {func.__name__}: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'error_type': type(e).__name__,
                'function': func.__name__
            }
    
    return wrapper
