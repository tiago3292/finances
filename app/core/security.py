from datetime import datetime, timedelta, timezone
from typing import Annotated
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.token import TokenData
from app.schemas.user import UserInDB

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypwd")

# Transforma senha em hash
def get_password_hash(password):
    return password_hash.hash(password)

# Verifica se a senha recebida bate com o hash armazenado
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

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
def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=404, detail="User not found")
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return token_data

