from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine
from app.api.routes import auth, items, uploads, users
import app.models

app = FastAPI(
    title="Finances API",
    description="API REST de finanças pessoais com autenticação por token",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])