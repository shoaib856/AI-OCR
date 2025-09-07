
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "رقمنة الوثائق - واجهة كاملة"
    DEBUG: bool = False
    RQMNH_API_URL: str = "https://moj-rqmnh-api-main.azurewebsites.net/api/v1/digitization/document/full"
    DEFAULT_LANG: str = "ar"
    DEFAULT_CLASIFIER: bool = True
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["*"])

    class Config:
        env_file = ".env"

settings = Settings()
