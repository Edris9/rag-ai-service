from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth.auth import fake_users, verify_password, create_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    user = fake_users.get(request.username)
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Fel användarnamn eller lösenord")
    
    token = create_token(request.username)
    
    return {"access_token": token, "token_type": "bearer"}