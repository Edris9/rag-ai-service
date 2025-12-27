from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.auth.dependencies import require_auth
import uuid
from app.services.pdf_extractor import extract_text_from_pdf
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embeddings
from app.rag.vector_store import init_vector_store, add_to_store
from app.services.pdf_extractor import extract_text_from_pdf

router = APIRouter()

# Temporär lagring (dict i minnet)
uploaded_documents = {}
vector_store_initialized = False

@router.post("/upload")

async def upload_document(file: UploadFile = File(...), user: str = Depends(require_auth)):
    global vector_store_initialized
    
    allowed_types = ["application/pdf", "text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Endast PDF och TXT tillåtna"
        )
    
    doc_id = str(uuid.uuid4())
    content = await file.read()
    
    # Extrahera text
    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(content)
    else:
        text = content.decode("utf-8")
    
    # Chunka text
    chunks = chunk_text(text)
    
    # Skapa embeddings
    embeddings = create_embeddings(chunks)
    
    # Initiera vector store om första gången
    if not vector_store_initialized:
        init_vector_store()
        vector_store_initialized = True
    
    # Lägg till i vector store
    add_to_store(chunks, embeddings)
    
    # Spara metadata
    uploaded_documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "chunks": len(chunks)
    }
    
    return {
        "message": "✅ Dokument processad och indexerad!",
        "document_id": doc_id,
        "filename": file.filename,
        "chunks_created": len(chunks)
    }

@router.get("/")
async def list_documents(user: str = Depends(require_auth)):
    return {"documents": list(uploaded_documents.values())}


@router.post("/clear")
async def clear_documents(user: str = Depends(require_auth)):
    """Rensa alla dokument från minnet."""
    global uploaded_documents
    uploaded_documents = {}
    
    # Rensa vector store
    from app.rag.vector_store import init_vector_store
    init_vector_store()
    
    return {"message": "✅ Alla dokument rensade!"}