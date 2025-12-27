import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface QueryCardProps {
  token: string;
}

interface Source {
  content: string;
  metadata?: Record<string, unknown>;
  score?: number;
}

interface QueryResult {
  question: string;
  answer: string;
  sources: Source[];
}

const API_BASE = "http://127.0.0.1:8000";

export function QueryCard({ token }: QueryCardProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState("");
  const [expandedSources, setExpandedSources] = useState(false);

  const handleQuery = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/query/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Query failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 border-gradient animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Ask Questions</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            className="flex-1"
          />
          <Button
            onClick={handleQuery}
            disabled={loading || !question.trim()}
            variant="glow"
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Answer */}
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="mb-2 text-sm text-muted-foreground font-mono">
                Q: {result.question}
              </p>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {result.answer}
                </p>
              </div>
            </div>

            {/* Sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                <button
                  onClick={() => setExpandedSources(!expandedSources)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Sources ({result.sources.length})
                    </span>
                  </div>
                  {expandedSources ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSources && (
                  <div className="border-t border-border p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                    {result.sources.map((source, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-secondary/30 p-3 text-sm animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <p className="text-muted-foreground leading-relaxed font-mono text-xs">
                          {source.content}
                        </p>
                        {source.score !== undefined && (
                          <p className="mt-2 text-xs text-primary">
                            Relevance: {(source.score * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
