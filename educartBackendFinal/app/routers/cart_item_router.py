
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.cart_item import CartItemCreate, CartItemResponse
from app.repositories.cart_item_repository import add_item_to_cart

cart_item_router = APIRouter(prefix="/cart-items", tags=["Cart Items"])

@cart_item_router.post("/{cart_id}", response_model=CartItemResponse)
def add_item(cart_id: int, item: CartItemCreate, db: Session = Depends(get_db)):
    return add_item_to_cart(db, cart_id, item)
