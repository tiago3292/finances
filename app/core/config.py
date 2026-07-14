from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Field(default=...) evita erros na IDE
    database_url: str = Field(default=...)
    secret_key: str = Field(default=...)

    # Nova sintaxe do Pydantic v2 para carregar o arquivo .env
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()