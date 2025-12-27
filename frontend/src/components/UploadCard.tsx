import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle, X } from "lucide-react";

interface UploadCardProps {
  token: string;
}

interface UploadResult {
  document_id: string;
  chunks_created: number;
  message: string;
}

const API_BASE = "http://127.0.0.1:8000";

export function UploadCard({ token }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 border-gradient animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Document Upload</h2>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 transition-all hover:border-primary/50 hover:bg-secondary/50"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to select PDF or TXT file
          </p>
        </div>

        {file && (
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={clearFile}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}

        {result && (
          <div className="rounded-lg bg-primary/10 p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Upload Successful</span>
            </div>
            <div className="space-y-1 text-sm font-mono">
              <p className="text-muted-foreground">
                Document ID: <span className="text-foreground">{result.document_id}</span>
              </p>
              <p className="text-muted-foreground">
                Chunks created: <span className="text-foreground">{result.chunks_created}</span>
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          variant="glow"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
