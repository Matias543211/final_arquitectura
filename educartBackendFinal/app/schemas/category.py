from pydantic import BaseModel
from typing import Optional


class CategoryName(BaseModel):
    """Esquema mínimo para solo mostrar el nombre de la categoría."""
    name: str
    
    class Config:
        orm_mode = True 

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True