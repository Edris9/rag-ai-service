from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import search
from app.rag.llm import generate_answer

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


@router.post("/")
async def query_documents(request: QueryRequest):
    
    # Embed frågan
    query_embedding = create_embeddings([request.question])[0]
    
    # Sök i vector store
    chunks = search(query_embedding, top_k=3)
    
    # Generera svar med LLM
    answer = generate_answer(request.question, chunks)
    
    return {
        "question": request.question,
        "answer": answer,
        "sources": chunks
    }