import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2, CheckCircle } from "lucide-react";

interface LoginCardProps {
  onLogin: (token: string) => void;
  isLoggedIn: boolean;
}

const API_BASE = "http://127.0.0.1:8000";

export function LoginCard({ onLogin, isLoggedIn }: LoginCardProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      onLogin(data.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-6 border-gradient animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Authenticated</p>
            <p className="text-sm text-muted-foreground font-mono">Session active</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 border-gradient animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <LogIn className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Authentication</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}

        <Button
          onClick={handleLogin}
          disabled={loading || !username || !password}
          variant="glow"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
