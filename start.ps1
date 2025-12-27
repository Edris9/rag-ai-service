Start-Process powershell -ArgumentList "cd D:\Python\rag-ai-service; uvicorn app.main:app --reload"
Start-Process powershell -ArgumentList "cd D:\Python\rag-ai-service\frontend; npm run dev"