from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.item import Item 

class User(Base):
    __tablename__ = "users"

    # mapped_column() só é necessário para declarar a primary key
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(server_default=("False"))
    items: Mapped[list["Item"]] = relationship(back_populates="owner")