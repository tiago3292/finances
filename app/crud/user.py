from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
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

def read_users_me(current_user: User, db: Session):
    user = db.query(User).options(
        joinedload(User.items) # <- Carrega os itens junto com o usuário na mesma query
    ).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def update_user_me(current_user: User, user_data: UserUpdate, db: Session):
    updated_fields = user_data.model_dump(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user
    
def delete_user_me(current_user: User, db: Session):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}