from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Настройки API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "SkillPulse API"
    
    # Настройки CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # Настройки HH API
    HH_API_URL: str = "https://api.hh.ru"
    HH_API_TIMEOUT: int = 30
    
    class Config:
        case_sensitive = True

settings = Settings() 