from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserLogin, Token, UserRead, UserUpdate
from app.models.user import User
from app.core.security import create_access_token, get_current_user # <-- Usamos esta función

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repo = UserRepository(db)
    return UserService(repo)

@auth_router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)

    existing_user = repo.get_by_username(user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    user = service.create_user(user_data)
    return user


@auth_router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Autentica al usuario usando username y password (enviados como JSON) 
    y devuelve un token JWT.
    """
    repo = UserRepository(db)
    service = UserService(repo)
    
    user = service.authenticate_user(
        username=form_data.username, 
        password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token( 
        data={"sub": str(user.id)} 
    )
    

    return {"access_token": access_token, "token_type": "bearer", "name": user.name , "username": user.username, "id": user.id, "role": user.role, "email": user.email}



@auth_router.patch(
    "/me", 
    response_model=UserRead,
    dependencies=[Depends(get_current_user)]
)
def update_current_user(
    update_data: UserUpdate, 
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """Permite al usuario autenticado actualizar su propia información."""
    
    try:
        updated_user = service.update_user_data(current_user, update_data)
        return updated_user
    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar el usuario: {e}"
        )

