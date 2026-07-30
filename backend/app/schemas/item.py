from datetime import datetime
from enum import Enum
from pydantic import BaseModel, model_validator


class ItemType(str, Enum):
    EXPENSE = "gasto"
    EARNING = "ganho"


class ExpenseCategory(str, Enum):
    BILLS = "contas"
    GROCERIES = "mercado"
    TRANSPORTATION = "transporte"
    MAINTENANCES = "manutenções"
    LEISURE = "lazer"
    OTHER_EXPENSE = "outro gasto"


class EarningCategory(str, Enum):
    SALARY = "salário"
    ADVANCE = "vale"
    OTHER_EARNING = "outro ganho"

# Evita repetir a mesma lógica e campos no ItemCreate e ItemResponse
class ItemBase(BaseModel):
    title: str
    value: float
    type: ItemType
    category: ExpenseCategory | EarningCategory

    @model_validator(mode="after")
    def validate_category_by_type(self):
        # Garante que gastos usem apenas categorias de gastos
        if self.type == ItemType.EXPENSE and not isinstance(
            self.category, ExpenseCategory
        ):
            raise ValueError(
                f"Para o tipo '{ItemType.EXPENSE.value}', a categoria deve ser uma das opções de ExpenseCategory."
            )
        # Garante que ganhos usem apenas categorias de ganhos
        if self.type == ItemType.EARNING and not isinstance(
            self.category, EarningCategory
        ):
            raise ValueError(
                f"Para o tipo '{ItemType.EARNING.value}', a categoria deve ser uma das opções de EarningCategory."
            )
        return self

    uploaded_file: str | None = None


class ItemCreate(ItemBase):
    pass


class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    owner_id: int

    model_config = {"from_attributes": True}


class ItemUpdate(BaseModel):
    title: str | None = None
    value: float | None = None
    type: ItemType | None = None
    category: ExpenseCategory | EarningCategory | None = None

    @model_validator(mode="after")
    def validate_update_category(self):
        # Validação condicional caso ambos ou apenas um deles seja enviado no update
        if self.category is not None:
            # Se o tipo mudou ou foi enviado, valida contra ele. Se não, assume que valida contra qualquer um (ou você precisará buscar o tipo atual no banco de dados antes de atualizar)
            if self.type == ItemType.EXPENSE and not isinstance(
                self.category, ExpenseCategory
            ):
                raise ValueError(
                    "Categoria inválida para o tipo de item selecionado."
                )
            if self.type == ItemType.EARNING and not isinstance(
                self.category, EarningCategory
            ):
                raise ValueError(
                    "Categoria inválida para o tipo de item selecionado."
                )
        return self

    uploaded_file: str | None = None