"""Performance monitoring and metrics.

Tracks request latency, throughput, and errors.
"""

import time
import logging
from functools import wraps
from typing import Dict, List, Callable
from collections import defaultdict, deque
from datetime import datetime

logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """Track application performance metrics."""
    
    def __init__(self, max_history: int = 1000):
        self.request_count = defaultdict(int)
        self.error_count = defaultdict(int)
        self.request_durations = defaultdict(lambda: deque(maxlen=max_history))
        self.start_time = time.time()
    
    def record_request(self, endpoint: str, duration: float, success: bool = True):
        """Record request metrics."""
        self.request_count[endpoint] += 1
        self.request_durations[endpoint].append(duration)
        
        if not success:
            self.error_count[endpoint] += 1
    
    def get_stats(self, endpoint: str) -> Dict[str, float]:
        """Get statistics for an endpoint."""
        durations = list(self.request_durations[endpoint])
        
        if not durations:
            return {
                'count': 0,
                'errors': 0,
                'avg_duration': 0,
                'min_duration': 0,
                'max_duration': 0
            }
        
        return {
            'count': self.request_count[endpoint],
            'errors': self.error_count[endpoint],
            'avg_duration': sum(durations) / len(durations),
            'min_duration': min(durations),
            'max_duration': max(durations),
            'p95_duration': sorted(durations)[int(len(durations) * 0.95)] if len(durations) > 20 else max(durations)
        }
    
    def get_all_stats(self) -> Dict[str, Dict]:
        """Get all endpoint statistics."""
        uptime = time.time() - self.start_time
        
        return {
            'uptime_seconds': uptime,
            'endpoints': {
                endpoint: self.get_stats(endpoint)
                for endpoint in self.request_count.keys()
            },
            'total_requests': sum(self.request_count.values()),
            'total_errors': sum(self.error_count.values())
        }


def track_performance(endpoint: str):
    """Decorator to track function performance."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start = time.time()
            success = True
            
            try:
                result = await func(*args, **kwargs)
                return result
            except Exception as e:
                success = False
                raise
            finally:
                duration = time.time() - start
                monitor = get_monitor()
                monitor.record_request(endpoint, duration, success)
                
                if duration > 5.0:  # Warn on slow requests
                    logger.warning(
                        f"Slow request to {endpoint}: {duration:.2f}s"
                    )
        
        return wrapper
    return decorator


# Global instance
_monitor = None

def get_monitor() -> PerformanceMonitor:
    """Get or create global performance monitor."""
    global _monitor
    if _monitor is None:
        _monitor = PerformanceMonitor()
    return _monitor


def get_metrics() -> Dict[str, any]:
    """Get current performance metrics."""
    monitor = get_monitor()
    return monitor.get_all_stats()
