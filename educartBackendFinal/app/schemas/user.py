from pydantic import BaseModel, EmailStr, validator, Field
from sqlmodel import SQLModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    name: str
    email: str
    password: str
    role: str = "client"

    @validator("role")
    def role_must_be_valid(cls, v):
        allowed_roles = {"client", "admin"}
        if v not in allowed_roles:
            raise ValueError(f"El rol debe ser uno de: {', '.join(sorted(allowed_roles))}.")
        return v

    @validator("password")
    def password_not_hashed(cls, v):
        if v.startswith("$2b$") or v.startswith("$2a$"):
            raise ValueError("La contraseña no debe estar cifrada.")
        return v

class UserRead(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True
        
class UserUpdate(BaseModel):
    """Esquema para la actualización parcial (PATCH) de los datos del usuario."""
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str


class Token(SQLModel):
    """Esquema de salida para el token JWT."""
    access_token: str
    token_type: str = "bearer"
    name: str = Field(..., description="El nombre del usuario autenticado")
    username: str = Field(..., description="El username del usuario autenticado")
    id: int = Field(..., description="El id del usuario autenticado")
    role: str = Field(..., description="El rol del usuario autenticado")
    email: EmailStr = Field(..., description="El email del usuario autenticado")

class TokenData(SQLModel):
    id: Optional[int] = None