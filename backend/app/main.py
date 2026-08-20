from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine
from app.api.routes import auth, users, items, uploads
from app.core.config import settings
import app.models

app = FastAPI(
    title="Finances API",
    description="API REST de finanças pessoais com autenticação por token",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.cors_deploy,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://finance-frontend:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])

app.mount("/static", StaticFiles(directory="app/static"), name="static")
