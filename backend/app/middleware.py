import logging
import time
from typing import Dict, Tuple

from fastapi import HTTPException, Request, status
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

class RateLimitMiddleware:
    """Middleware для ограничения количества запросов"""
    
    def __init__(self, requests_per_minute: int = 60, requests_per_hour: int = 1000):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.minute_requests: Dict[str, list] = {}
        self.hour_requests: Dict[str, list] = {}
    
    async def __call__(self, request: Request, call_next):
        client_ip = get_remote_address(request)
        current_time = time.time()
        
        # Проверяем лимит в минуту
        if not self._check_rate_limit(client_ip, current_time, 60, self.requests_per_minute, self.minute_requests):
            logger.warning(f"Rate limit exceeded for IP: {client_ip} (per minute)")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests per minute"
            )
        
        # Проверяем лимит в час
        if not self._check_rate_limit(client_ip, current_time, 3600, self.requests_per_hour, self.hour_requests):
            logger.warning(f"Rate limit exceeded for IP: {client_ip} (per hour)")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests per hour"
            )
        
        # Логируем запрос
        logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")
        
        # Выполняем запрос
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Логируем ответ
        logger.info(f"Response: {response.status_code} in {process_time:.3f}s")
        
        return response
    
    def _check_rate_limit(self, client_ip: str, current_time: float, window: int, limit: int, requests_dict: Dict[str, list]) -> bool:
        """Проверяет лимит запросов для заданного окна времени"""
        if client_ip not in requests_dict:
            requests_dict[client_ip] = []
        
        # Удаляем старые запросы
        requests_dict[client_ip] = [
            req_time for req_time in requests_dict[client_ip] 
            if current_time - req_time < window
        ]
        
        # Проверяем лимит
        if len(requests_dict[client_ip]) >= limit:
            return False
        
        # Добавляем текущий запрос
        requests_dict[client_ip].append(current_time)
        return True

class LoggingMiddleware:
    """Middleware для детального логирования"""
    
    async def __call__(self, request: Request, call_next):
        # Логируем начало запроса
        logger.info(f"Request started: {request.method} {request.url.path}")
        
        # Выполняем запрос
        response = await call_next(request)
        
        # Логируем результат
        logger.info(f"Request completed: {request.method} {request.url.path} -> {response.status_code}")
        
        return response
