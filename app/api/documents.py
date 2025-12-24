from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid

router = APIRouter()

# Temporär lagring (dict i minnet)
uploaded_documents = {}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    
    # Validera filtyp
    allowed_types = ["application/pdf", "text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Endast PDF och TXT tillåtna"
        )
    
    # Skapa unikt ID
    doc_id = str(uuid.uuid4())
    
    # Läs innehåll
    content = await file.read()
    
    # Spara metadata
    uploaded_documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "size": len(content)
    }
    
    return {
        "message": "✅ Dokument uppladdat!",
        "document_id": doc_id,
        "filename": file.filename
    }


@router.get("/")
async def list_documents():
    return {"documents": list(uploaded_documents.values())}