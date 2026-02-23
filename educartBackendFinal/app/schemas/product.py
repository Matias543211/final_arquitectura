from pydantic import BaseModel
from typing import List, Optional
from app.schemas.category import CategoryName

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: Optional[int] = None
    sku: str
    stock_current: int
    stock_min: int = 10
    image_url: Optional[str] = None
    rating: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock_current: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    rating: int = 0
    stock_status: str 
    
    category: Optional[CategoryName] 

    class Config:
        orm_mode = True


class ProductFilterParams(BaseModel):
    categories: Optional[List[str]] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    search: Optional[str] = None
    sort_by: Optional[str] = None
    order: Optional[str] = "asc"