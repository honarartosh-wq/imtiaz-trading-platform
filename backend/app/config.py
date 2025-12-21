from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Imtiaz Trading Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # MetaTrader
    MT5_SERVER: str = ""
    MT5_LOGIN: str = ""
    MT5_PASSWORD: str = ""
    MT5_TIMEOUT: int = 60000

    # Admin User - MUST be set via environment variables for security
    # SECURITY: Never hardcode credentials - always use environment variables
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_NAME: str = "System Admin"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate critical settings
        self._validate_settings()

    def _validate_settings(self):
        """Validate critical configuration settings"""
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is required but not set")
        
        if not self.SECRET_KEY or len(self.SECRET_KEY) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters long. "
                "Generate with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
        
        # Check SECRET_KEY character diversity for cryptographic strength
        if self.SECRET_KEY and len(self.SECRET_KEY) >= 32:
            has_alpha = any(c.isalpha() for c in self.SECRET_KEY)
            has_digit = any(c.isdigit() for c in self.SECRET_KEY)
            if not (has_alpha and has_digit):
                raise ValueError(
                    "SECRET_KEY should contain both letters and numbers for better security. "
                    "Use the recommended generation command."
                )
        
        if not self.ADMIN_EMAIL:
            raise ValueError("ADMIN_EMAIL is required for initial setup")
        
        if not self.ADMIN_PASSWORD or len(self.ADMIN_PASSWORD) < 8:
            raise ValueError(
                "ADMIN_PASSWORD is required and must be at least 8 characters long. "
                "Use a strong password with mixed case, numbers, and special characters."
            )


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
