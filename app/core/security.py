from datetime import datetime, timedelta, timezone
from typing import Annotated
from pwdlib import PasswordHash
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.token import Token
from app.api.deps import get_user

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypwd")

# Transforma senha em hash
def get_password_hash(password):
    return password_hash.hash(password)

# Verifica se a senha recebida bate com o hash armazenado
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.password):
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

def login_handler(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                  db: Session) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")