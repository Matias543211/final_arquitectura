from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.user import UserRole


from app.core.config import settings
from app.schemas.user import TokenData 
from app.core.database import get_db 
from app.repositories.user_repository import UserRepository
from app.models.user import User 

# Configuración de Hashing
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"], 
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    """Genera el hash seguro de una contraseña (Usado en el registro)."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña coincide con su hash (Usado en el login)."""
    return pwd_context.verify(plain_password, hashed_password)

# Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") 

# Funciones de JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea un token de acceso JWT con fecha de expiración."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Añadimos la expiración al payload
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[TokenData]:
    """Decodifica un token de acceso JWT y retorna los datos."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Nota: Usamos "sub" para el ID, que es un entero
        user_id: int = payload.get("sub") 
        if user_id is None:
            return None
        return TokenData(id=user_id) 
    except JWTError:
        # Si el token es inválido o expiró
        return None

# Dependencia para Rutas Protegidas 

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Decodifica el token, busca el usuario en la BD y lo retorna.
    Esta dependencia es usada en todas las rutas que requieren autenticación.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_access_token(token)
    if token_data is None:
        raise credentials_exception

    user_repo = UserRepository(db)
    user = user_repo.get_user_by_id(token_data.id) 
    
    if user is None:
        raise credentials_exception
    
        
    return user


async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependencia usada para proteger rutas que solo el Administrador debe acceder.
    Reutiliza get_current_user para autenticar primero.
    """
    if current_user.role != "admin": 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso. Se requiere rol de administrador.",
        )
    return current_user