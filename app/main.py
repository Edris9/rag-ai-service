from fastapi import FastAPI

app = FastAPI(
    title="RAG AI Service",
    description="Production-ready AI RAG Service",
    version="1.0.0"
)


@app.get("/")
async def root():
    return {"message": "🚀 RAG AI Service is running!"}


@app.get("/health")
async def health():
    return {"status": "healthy"}