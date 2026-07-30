import uuid
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session, joinedload
from starlette.concurrency import run_in_threadpool

from app.models.user import User
from app.models.item import Item
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.item import ItemType
from app.core.security import get_password_hash
from app.core.config import settings

UPLOAD_DIR = Path("app/static")

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



# ---Lógica do Dashboard--- #
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



# ---Lógica do upload de arquivos--- #
def process_upload(content: bytes) -> str:

    # Abre a imagem através dos bytes recebidos. Levanta erro se o arquivo não for válido
    with Image.open(BytesIO(content)) as original:

        # Remove metadata de orientação de imagem, se possuir alguma
        img = ImageOps.exif_transpose(original)

        # Recorta a imagem nos valores especificados. Usa LANCZOS para resamplig de alta qualidade
        #img = ImageOps.fit(img, (300,300), method=Image.Resampling.LANCZOS)

        # Converte a imagem para RGB se necessário
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")

        # Gera um nome único para evitar conflitos na banco de dados
        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = UPLOAD_DIR / filename

        # Certifica que o diretório existe. Cria o diretório se não existir
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # Salva a imagem como jpeg, qualidade 85 e otimizada
        img.save(filepath, "JPEG", quality=85, optimize=True)
        
    # Retorna o nome da imagem, que é o que será armazenado no banco de dados
    return filename

async def upload_file(current_user: User, file: UploadFile, db: Session):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User do not have permission"
        )
    content = await file.read()
    if len(content) > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is {settings.max_upload_size_bytes // (1024 * 1024)}MB",
        )
    try:
        new_file = await run_in_threadpool(process_upload, content)
    except UnidentifiedImageError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file. Please upload a valid image (JPEG, PNG, GIR, WebP)"
        ) from err
    current_user.uploaded_file = new_file
    db.commit()
    db.refresh(current_user)
    return current_user

async def read_files(current_user: User, db: Session):
    if db.query(User).filter(User.id != current_user.id).first():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User do not have permission"
        )
    if not current_user.uploaded_file:
        return {"no files": "Nothing to show"}
    return current_user.uploaded_file

async def delete_file(filename: str, current_user: User, db: Session):
    if db.query(User).filter(User.id != current_user.id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file to delete",
        )
    filepath = UPLOAD_DIR / filename
    if filepath.exists():
        filepath.unlink()
    current_user.uploaded_file = None
    db.commit()
    db.refresh(current_user)
    return {"Message": "File deleted successfully"}