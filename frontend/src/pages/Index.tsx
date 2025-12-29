import { useState, useEffect } from "react";
import { LoginCard } from "@/components/LoginCard";
import { UploadCard } from "@/components/UploadCard";
import { QueryCard } from "@/components/QueryCard";
import { Database, Terminal, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);

  // Apply dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">RAG API Tester</h1>
              <p className="text-xs text-muted-foreground font-mono">127.0.0.1:8000</p>
            </div>
          </div>

          {token && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="mb-8 flex items-center gap-2 rounded-lg bg-secondary/30 px-4 py-2 font-mono text-sm">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Status:</span>
          <span className={token ? "text-primary" : "text-muted-foreground"}>
            {token ? "● Connected" : "○ Not authenticated"}            
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <LoginCard onLogin={setToken} isLoggedIn={!!token} />
            
            {token && <UploadCard token={token} />}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {token ? (
              <QueryCard token={token} />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
                <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Login to start querying your documents
                </p>
              </div>
            )}
          </div>
        </div>

        {/* API Info Footer */}
        <footer className="mt-12 rounded-xl border border-border bg-card/50 p-6">
          <h3 className="mb-4 font-semibold text-foreground">API Endpoints</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="mb-1 font-mono text-xs text-primary">POST</p>
              <p className="font-mono text-sm text-foreground">/auth/login</p>
              <p className="mt-1 text-xs text-muted-foreground">Authenticate user</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="mb-1 font-mono text-xs text-primary">POST</p>
              <p className="font-mono text-sm text-foreground">/documents/upload</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload PDF/TXT files</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4">
              <p className="mb-1 font-mono text-xs text-primary">POST</p>
              <p className="font-mono text-sm text-foreground">/query/</p>
              <p className="mt-1 text-xs text-muted-foreground">Ask questions</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
