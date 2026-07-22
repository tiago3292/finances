from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud import user as crud
from app.schemas import user as schema

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schema.UserResponse)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(user, db)

@router.get("/{user_id}", response_model=schema.UserResponse)
def fetch_user(user_id: int, db: Session = Depends(get_db)):
    return crud.read_users_me(user_id, db)

@router.put("/{user_id}", response_model=schema.UserResponse)
def update_user(user_id: int, user: schema.UserCreate, db: Session = Depends(get_db)):
    return crud.update_user_me(user_id, user, db)

@router.delete("/{user_id}")
def del_user(user_id: int, db: Session = Depends(get_db)):
    return crud.delete_user_me(user_id, db)