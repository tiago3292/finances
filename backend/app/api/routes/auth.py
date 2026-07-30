from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_db
from app.crud import user as crud
from app.schemas import user as schema
from app.core.security import login_handler

router = APIRouter()

@router.post("/register", response_model=schema.UserResponse)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(user, db)

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                db: Session = Depends(get_db)):
    return login_handler(form_data, db)