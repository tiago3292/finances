from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Carrega variáveis do .env para serem acessadas pelo app
class Settings(BaseSettings):
    # Field(default=...) evita erros na IDE
    database_url: str = Field(default=..., alias="DATABASE_URL")
    secret_key: str = Field(default=..., alias="SECRET_KEY")
    algorithm: str = Field(default=..., alias="ALGORITHM")
    access_token_expire_minutes: int = Field(default=..., alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    cors_deploy: str | None = None

    # Limitação do tamanho máximo permitido por arquivo
    max_upload_size_bytes: int = 8 * 1024 * 1024

    # Nova sintaxe do Pydantic v2 para carregar o arquivo .env
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        populate_by_name=True,
    )

settings = Settings()
