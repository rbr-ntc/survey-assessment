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
    
    def __init__(self, app, requests_per_minute: int = 60, requests_per_hour: int = 1000):
        self.app = app
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.minute_requests: Dict[str, list] = {}
        self.hour_requests: Dict[str, list] = {}
    
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope)
            client_ip = get_remote_address(request)
            current_time = time.time()
            
            # Проверяем лимит в минуту
            if not self._check_rate_limit(client_ip, current_time, 60, self.requests_per_minute, self.minute_requests):
                logger.warning(f"Rate limit exceeded for IP: {client_ip} (per minute)")
                # Отправляем ошибку 429
                await send({
                    "type": "http.response.start",
                    "status": 429,
                    "headers": [(b"content-type", b"application/json")]
                })
                await send({
                    "type": "http.response.body",
                    "body": b'{"detail": "Too many requests per minute"}'
                })
                return
            
            # Проверяем лимит в час
            if not self._check_rate_limit(client_ip, current_time, 3600, self.requests_per_hour, self.hour_requests):
                logger.warning(f"Rate limit exceeded for IP: {client_ip} (per hour)")
                # Отправляем ошибку 429
                await send({
                    "type": "http.response.start",
                    "status": 429,
                    "headers": [(b"content-type", b"application/json")]
                })
                await send({
                    "type": "http.response.body",
                    "body": b'{"detail": "Too many requests per hour"}'
                })
                return
            
            # Логируем запрос
            logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")
        
        # Выполняем запрос
        await self.app(scope, receive, send)
    
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
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope)
            # Логируем начало запроса
            logger.info(f"Request started: {request.method} {request.url.path}")
        
        # Выполняем запрос
        await self.app(scope, receive, send)
        
        if scope["type"] == "http":
            # Логируем результат
            logger.info(f"Request completed: {request.method} {request.url.path}")
