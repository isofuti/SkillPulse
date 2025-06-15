from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Настройки API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "HR SkillPulse"
    
    # Настройки CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # Настройки HH API
    HH_API_URL: str = "https://api.hh.ru"
    HH_API_TIMEOUT: int = 30
    
    # Настройки БД
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/hr_skillpulse"
    )
    
    # Настройки Yandex Cloud
    YC_SERVICE_ACCOUNT_ID: Optional[str] = os.getenv("YC_SERVICE_ACCOUNT_ID")
    YC_KEY_ID: Optional[str] = os.getenv("YC_KEY_ID")
    YC_PRIVATE_KEY: Optional[str] = os.getenv("YC_PRIVATE_KEY")
    
    # Настройки кэша
    CACHE_TTL: int = 3600  # 1 hour
    
    class Config:
        case_sensitive = True

settings = Settings() 