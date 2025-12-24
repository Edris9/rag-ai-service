from fastapi import FastAPI
from app.api import documents

app = FastAPI(
    title="RAG AI Service",
    description="Production-ready AI RAG Service",
    version="1.0.0"
)

app.include_router(documents.router, prefix="/documents", tags=["Documents"])

@app.get("/")
async def root():
    return {"message": "🚀 RAG AI Service is running!"}


@app.get("/health")
async def health():
    return {"status": "healthy"}