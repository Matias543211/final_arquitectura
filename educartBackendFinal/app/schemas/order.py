# app/schemas/order_schema.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ProductInOrderRead(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class OrderItemRead(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    
    product: Optional[ProductInOrderRead] = None
    
    class Config:
        from_attributes = True

class OrderRead(BaseModel):
    id: int
    user_id: int
    order_date: datetime
    status: str
    shipping_address: str
    locality: str
    total_amount: float
    items: List[OrderItemRead]
    
    class Config:
        from_attributes = True
        
# Esquema de Entrada (Para crear una Orden)
class OrderCreate(BaseModel):
    """Esquema usado por el Router para recibir los datos necesarios para la compra."""
    shipping_address: str = Field(..., description="Dirección de envío/contacto")
    locality: str
    
    
    
class OrderStatusUpdate(BaseModel):
    status: str 