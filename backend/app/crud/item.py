import uuid
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from app.schemas.item import ItemCreate, ItemUpdate
from app.models.user import User
from app.models.item import Item
from app.core.config import settings

UPLOAD_DIR = Path("app/static")

def create_item(item: ItemCreate, owner: User, db: Session):
    new_item = Item(
        title=item.title,
        value=item.value,
        type=item.type.value,
        category=item.category.value,
        owner_id=owner.id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def list_items(owner: User, db: Session):
    items = db.query(Item).filter(Item.owner_id == owner.id).all()
    if not items:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    return items

def read_item(item_id: int, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="Você não possui permissão para ver este item.")
    return item

def update_item(item_id: int, updated_item: ItemUpdate, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="Você não possui permissão para ver este item.")
    updated_fields = updated_item.model_dump(exclude_unset=True)
    for key, value in updated_fields.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

def delete_item(item_id: int, owner: User, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="Você não possui permissão para ver este item.")
    if item.uploaded_file:
        filepath = UPLOAD_DIR / item.uploaded_file
        if filepath.exists():
            filepath.unlink()
    db.delete(item)
    db.commit()
    return {"message": "Item deletado com sucesso."}



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

async def upload_file(owner: User, item_id: int, file: UploadFile, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    if item.owner_id != owner.id:
        raise HTTPException(status_code=403, detail="Você não possui permissão para ver este item.")
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
            detail="Arquivo inválido. Por favor, faça upload de um arquivo de imagem válido (JPEG, PNG, GIR, WebP)"
        ) from err
    item.uploaded_file = new_file
    db.commit()
    db.refresh(item)
    return {"Mensagem": "Imagem carregada com sucesso."}

async def delete_file(filename: str, current_user: User, db: Session):
    current_item = db.query(Item).filter(Item.owner_id == current_user.id, Item.uploaded_file == filename).first()
    if not current_item:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="O usuário não possui permissão"
            )
    filepath = UPLOAD_DIR / filename
    if filepath.exists():
        filepath.unlink()
    current_item.uploaded_file = None
    db.commit()
    db.refresh(current_item)
    return {"Mensagem": "Arquivo deletado com sucesso."}