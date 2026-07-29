from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Carrega variáveis do .env para serem acessadas pelo app
class Settings(BaseSettings):
    # Field(default=...) evita erros na IDE
    database_url: str = Field(default=...)
    secret_key: str = Field(default=...)
    algorithm: str = Field(default=...)

    # Usar validation_alias com o nome da variável do arquivo .env
    # permite trocar o nome da variável no class Settings
    access_token_expire_minutes: int = Field(default=...)

    # Limitação do tamanho máximo permitido por arquivo
    max_upload_size_bytes: int = 8 * 1024 * 1024

    # Nova sintaxe do Pydantic v2 para carregar o arquivo .env
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
    )

settings = Settings()