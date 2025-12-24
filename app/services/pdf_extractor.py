import fitz  # pymupdf


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extraherar text från PDF-bytes."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text