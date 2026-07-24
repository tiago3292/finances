from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_db
from app.crud import user as crud
from app.schemas import user as schema
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", response_model=schema.UserResponse)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(user, db)

@router.get("/users/me")
async def read_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

@router.put("/config/{user_id}", response_model=schema.UserResponse)
def update_user(user_id: int, user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.update_user_me(user_id, user, db)

@router.delete("/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return crud.delete_user_me(user_id, db)

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    pass



# Versão de busca de usuário sem sistema de autorização
'''@router.get("/users/{user_id}", response_model=schema.UserResponse)
def fetch_user(user_id: int, db: Session = Depends(get_db)):
    return crud.read_users_me(user_id, db)'''