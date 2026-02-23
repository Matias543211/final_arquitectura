from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User 
from app.core.security import get_db, get_current_user 

from app.schemas.cart import CartResponse, CartItemCreate, CartItemUpdate
from app.services.cart_service import CartService 

cart_router = APIRouter(
    prefix="/cart", 
    tags=["Cart"],
    dependencies=[Depends(get_current_user)] 
)

def get_cart_service(db: Session = Depends(get_db)) -> CartService:
    """Retorna una instancia del servicio de carrito con la sesión de BD inyectada."""
    return CartService(db)

# READ (Obtener Carrito)
@cart_router.get("/", response_model=CartResponse)
def get_user_cart(
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service)
):
    """Obtiene el carrito del usuario autenticado."""
   
    cart = service.get_cart_for_user(current_user.id) 
    
    if cart is None:
       
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carrito no encontrado (o usuario no válido)."
        )
    return cart

# ADD/UPDATE Item (Añadir al carrito)
@cart_router.post("/", response_model=CartResponse, status_code=status.HTTP_200_OK)
def add_item_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service)
):
    """
    Añade un producto al carrito del usuario autenticado.
    """
    try:
      
        updated_cart = service.add_or_update_item(current_user.id, item_data)
    except ValueError as e:
       
        if "Product not found" in str(e):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Producto no encontrado."
            )
        if "Stock insuficiente" in str(e):
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=str(e)
            )
        raise e
        
    return updated_cart

# UPDATE Quantity (Establecer cantidad específica)
@cart_router.put("/", response_model=CartResponse)
def update_item_in_cart(
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service)
):
    """
    Establece la cantidad de un ítem en el carrito del usuario.
    """
    # CAMBIO 3: Usamos current_user.id
    updated_cart = service.update_item_quantity_explicit(current_user.id, item_data)
    
    if updated_cart is None:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item no encontrado en el carrito o usuario inválido."
        )
    return updated_cart

# DELETE Item
@cart_router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item_from_cart(
    product_id: int,
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service)
):
    """Elimina un producto específico del carrito del usuario."""

    success = service.remove_item_from_cart(current_user.id, product_id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item no encontrado en el carrito."
        )
    return

# DELETE All Items (Vaciar Carrito)
@cart_router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_user_cart(
    current_user: User = Depends(get_current_user),
    service: CartService = Depends(get_cart_service)
):
    """Vacía completamente el carrito del usuario autenticado."""
    success = service.empty_cart(current_user.id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Carrito no encontrado."
        )
    return