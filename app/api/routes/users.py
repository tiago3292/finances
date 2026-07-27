from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated

from app.api.deps import get_db
from app.crud import user as crud
from app.schemas import user as schema
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=schema.UserResponse)
async def read_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user

@router.patch("/me", response_model=schema.UserResponse)
def update_user(
    current_user: Annotated[User, Depends(get_current_user)],
    user: schema.UserUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_user_me(current_user, user, db)

@router.delete("/me")
def delete_user(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return crud.delete_user_me(current_user, db)