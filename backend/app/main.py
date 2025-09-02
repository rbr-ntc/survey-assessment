import logging
import os

from app.config import settings
from app.middleware import LoggingMiddleware, RateLimitMiddleware
from app.routers import questions, recommendations, results
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Настройка логирования
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="System Analyst Assessment API",
    description="API для оценки системных аналитиков с AI рекомендациями",
    version="1.0.0"
)

# Добавляем middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=settings.RATE_LIMIT_PER_MINUTE,
    requests_per_hour=settings.RATE_LIMIT_PER_HOUR
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
async def health_check():
    """Health check endpoint for Docker healthcheck"""
    logger.info("Health check requested")
    return {
        "status": "healthy", 
        "timestamp": "2024-01-01T00:00:00Z",
        "version": "1.0.0",
        "environment": "production"
    }

app.include_router(questions.router)
app.include_router(results.router)
app.include_router(recommendations.router)
