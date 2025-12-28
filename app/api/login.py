from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth.auth import verify_user, create_token, register_user

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    user = verify_user(request.username, request.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Fel användarnamn eller lösenord")
    
    token = create_token(request.username)
    
    return {"access_token": token, "token_type": "bearer", "user_id": user["id"]}


@router.post("/register")
async def register(request: RegisterRequest):
    user = register_user(request.username, request.password)
    
    if not user:
        raise HTTPException(status_code=400, detail="Användarnamn finns redan")
    
    return {"message": "Konto skapat!", "user_id": user["id"], "username": user["username"]}