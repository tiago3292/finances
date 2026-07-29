from decimal import Decimal
from typing import TYPE_CHECKING
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

# Importa o Enum definidos nos schemas
from app.schemas.item import ItemType  

if TYPE_CHECKING:
    from app.models.item import Item


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(server_default="False")
    
    items: Mapped[list["Item"]] = relationship(back_populates="owner")

    # Propriedade híbrida para calcular o saldo dinamicamente
    @hybrid_property
    def balance(self) -> Decimal:
        earnings = sum(
            (Decimal(str(item.value)) for item in self.items if item.type == ItemType.EARNING),
            Decimal("0.00")
        )
        expenses = sum(
            (Decimal(str(item.value)) for item in self.items if item.type == ItemType.EXPENSE),
            Decimal("0.00")
        )
        return earnings - expenses

    uploaded_files: Mapped[str] = mapped_column(nullable=True)