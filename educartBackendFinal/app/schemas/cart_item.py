from pydantic import BaseModel
from typing import Optional
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    subtotal: float
    product: Optional[ProductResponse]

    class Config:
        orm_mode = True
