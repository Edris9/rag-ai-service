from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid

from app.services.pdf_extractor import extract_text_from_pdf

router = APIRouter()

# Temporär lagring (dict i minnet)
uploaded_documents = {}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    
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
    
    # Spara med text
    uploaded_documents[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "size": len(content),
        "text": text,
        "text_length": len(text)
    }
    
    return {
        "message": "✅ Dokument uppladdat och text extraherad!",
        "document_id": doc_id,
        "filename": file.filename,
        "text_preview": text[:500] + "..." if len(text) > 500 else text
    }


@router.get("/")
async def list_documents():
    return {"documents": list(uploaded_documents.values())}