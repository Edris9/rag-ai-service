from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import search_vector_store
from app.rag.llm import generate_answer
from app.auth.dependencies import require_auth

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


@router.post("/")
async def query_documents(request: QueryRequest, user: str = Depends(require_auth)):
    
    chunks = search_vector_store(request.question, k=3)
    context_texts = [chunk["text"] for chunk in chunks]
    answer = generate_answer(request.question, context_texts)
        
    return {
        "question": request.question,
        "answer": answer,
        "sources": context_texts
    }