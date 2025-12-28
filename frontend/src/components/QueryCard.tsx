import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, Send, Loader2, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface QueryCardProps {
  token: string;
}

interface QueryResult {
  question: string;
  answer: string;
  sources: string[];
}

const API_BASE = "https://focused-prosperity-production-ebc4.up.railway.app";

export function QueryCard({ token }: QueryCardProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState("");
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

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
      setExpandedSources(new Set());
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

  const toggleSource = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Sources ({result.sources.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
                  {result.sources.map((source, index) => (
                    <Collapsible
                      key={index}
                      open={expandedSources.has(index)}
                      onOpenChange={() => toggleSource(index)}
                    >
                      <div 
                        className="rounded-lg border border-border bg-muted/30 overflow-hidden animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CollapsibleTrigger asChild>
                          <button className="w-full p-3 flex items-start justify-between gap-3 hover:bg-secondary/30 transition-colors text-left">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <p className="text-sm text-muted-foreground flex-1 font-mono text-xs leading-relaxed">
                                {expandedSources.has(index) 
                                  ? "Click to collapse" 
                                  : truncateText(source)}
                              </p>
                            </div>
                            {expandedSources.has(index) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-3 pb-3 pt-0">
                            <div className="p-3 rounded-md bg-secondary/50 border border-border/50">
                              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono text-xs">
                                {source}
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
