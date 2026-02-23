# app/routers/order_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.order import OrderCreate, OrderRead, OrderStatusUpdate
from app.services.order_service import OrderService
from app.core.security import get_current_user
from app.models.user import User

order_router = APIRouter(prefix="/orders", tags=["Orders"])


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    """Retorna una instancia del servicio de órdenes con la sesión de BD inyectada."""
    return OrderService(db)

# CREATE (Confirmar Checkout) - Protegido por autenticación
@order_router.post(
    "/", 
    response_model=OrderRead, 
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service)
):
    """
    Finaliza el proceso de compra. 
    Ejecuta la transacción atómica: Verifica Stock -> Resta Stock -> Crea Orden.
    """
    try:
      
        new_order = service.create_order_transactional(
            user_id=current_user.id, 
            order_data=order_data
        )
        return new_order
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e) 
        )
    except Exception as e:
        print(f"Error en la creación de orden: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar la orden. La transacción fue revertida."
        )

# READ (Historial de Órdenes del Cliente)
@order_router.get(
    "/my-orders", 
    response_model=list[OrderRead],
    dependencies=[Depends(get_current_user)]
)
def get_my_orders(
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service)
):
    """Obtiene el historial de órdenes del usuario autenticado."""
    return service.get_orders_by_user_id(current_user.id)


# ADMIN: Ver TODAS las órdenes (Para Dashboard)
@order_router.get(
    "/admin/all", 
    response_model=list[OrderRead],
    dependencies=[Depends(get_current_user)]
)
def get_all_orders_admin(
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Requiere privilegios de Administrador")
        
    return service.get_all_orders()




# UPDATE: cambia el estado de la orden
@order_router.patch("/{order_id}/status", response_model=OrderRead)
def change_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service)
):
    order = service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")


    is_admin = current_user.role == "admin"
    is_owner = order.user_id == current_user.id
    
    if not is_admin:
        if not is_owner:
            raise HTTPException(status_code=403, detail="No tienes permiso")
        if status_data.status != "Completed":
            raise HTTPException(status_code=403, detail="Solo puedes marcar la orden como Completada")

    return service.update_order_status(order_id, status_data.status)