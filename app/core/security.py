from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import HTTPException

from config import settings
from ..schemas.token import TokenData

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypwd")

# Transforma senha em hash
def get_password_hash(password):
    return password_hash.hash(password)

# Verifica se a senha recebida bate com o hash armazenado
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

# Cria uma cópia dos dados, adiciona data de expiração na cópia e cria o token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# Tenta decodificar um token e colocar os dados formatados pelo schema na variável token_data.
# Retorna erro se o sub(username) não for encontrado ou o token for inválido.
def verify_access_token(token: str, credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception