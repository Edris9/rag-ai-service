from fastapi import FastAPI
from app.api import documents,query


app = FastAPI(
    title="RAG AI Service",
    description="Production-ready AI RAG Service",
    version="1.0.0"
)

app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(query.router, prefix="/query", tags=["Query"])

@app.get("/")
async def root():
    return {"message": "🚀 RAG AI Service is running!"}


@app.get("/health")
async def health():
    return {"status": "healthy"}