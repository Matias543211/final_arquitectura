from pydantic import BaseModel
from typing import List, Optional
from app.schemas.product import ProductResponse # Asumo que existe

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    product: ProductResponse
    
    class Config:
        orm_mode = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse] = []
    
    class Config:
        orm_mode = True