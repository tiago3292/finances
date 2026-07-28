from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.user import User
from app.models.item import Item
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.item import ItemType
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

'''
Estatísticas que o Dashboard deve mostrar:
- Maior ganho (nome: valor)
- Marior gasto (nome: valor)
'''
def get_user_balance(current_user: User):
    return current_user.balance

def get_user_item_by_type(db: Session, current_user: User, type):
        return db.query(Item).filter(
            User.id == current_user.id,
            Item.type == type
            ).all()
    
def category_percentage(filtered_items):
    if not filtered_items:
        return {"No items": "Nothing to show"}
    total_value = sum(item.value for item in filtered_items)
    #Cria um dicionário com a soma dos valores agrupados por categoria
    category_totals = {}
    for item in filtered_items:
        category_totals[item.category] = category_totals.get(item.category, 0) + item.value
    #Gera o dicionário final com a porcentagem formatada como string inteira
    return {
        category: str(int((category_val / total_value) * 100)) + "%"
        for category, category_val in category_totals.items()
        }

def total_value_per_type(filtered_items):
    if not filtered_items:
        return {"No items": "Nothing to show"}
    return sum(item.value for item in filtered_items)

def get_biggest_value(filtered_items):
    biggest_value = max(filtered_items, key=lambda item: item.value)
    return {biggest_value.title: biggest_value.value}

def dashboard(current_user: User, db: Session):
    return {
        "Saldo atual": get_user_balance(current_user),
        "Resumo de gastos": category_percentage(
            get_user_item_by_type(db, current_user, ItemType.EXPENSE)
            ),
        "Resumo de ganhos": category_percentage(
            get_user_item_by_type(db, current_user, ItemType.EARNING)
            ),
        "Total de gastos": total_value_per_type(
            get_user_item_by_type(db, current_user, ItemType.EXPENSE)
            ),
        "Total de ganhos": total_value_per_type(
            get_user_item_by_type(db, current_user, ItemType.EARNING)
            ),
        "Gasto com o maior valor": get_biggest_value(
            get_user_item_by_type(db, current_user, ItemType.EXPENSE)
            ),
        "Ganho com o maior valor": get_biggest_value(
            get_user_item_by_type(db, current_user, ItemType.EARNING)
            )
        }