from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, query, login

app = FastAPI(
    title="RAG AI Service",
    description="Production-ready AI RAG Service",
    version="1.0.0"
)

# Lägg till CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router, prefix="/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(query.router, prefix="/query", tags=["Query"])


@app.get("/")
async def root():
    return {"message": "🚀 RAG AI Service is running!"}


@app.get("/health")
async def health():
    return {"status": "healthy"}