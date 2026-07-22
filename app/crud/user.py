from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def create_user(user: UserCreate, db: Session):
    user_exist = db.query(User).filter(User.username == user.username).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = User(
        username = user.username,
        email = user.email,
        password = get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def read_users_me(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_user_me(user_id: int, updated_user: UserCreate, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.username = updated_user.username
    user.email = updated_user.email
    user.password = get_password_hash(updated_user.password)
    db.commit()
    db.refresh(user)
    return user
    
def delete_user_me(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}