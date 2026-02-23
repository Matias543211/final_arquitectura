from sqlalchemy.orm import Session
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.cart import Cart
from app.schemas.cart_item import CartItemCreate

def add_item_to_cart(db: Session, cart_id: int, item_data: CartItemCreate):
    product = db.query(Product).filter(Product.id == item_data.product_id).first()
    if not product:
        return None

    subtotal = product.price * item_data.quantity
    item = CartItem(cart_id=cart_id, product_id=product.id, quantity=item_data.quantity, subtotal=subtotal)
    db.add(item)

    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    cart.total += subtotal

    db.commit()
    db.refresh(item)
    return item
