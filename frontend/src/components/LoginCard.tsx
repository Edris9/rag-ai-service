import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2, CheckCircle, UserPlus } from "lucide-react";

interface LoginCardProps {
  onLogin: (token: string) => void;
  isLoggedIn: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://focused-prosperity-production-ebc4.up.railway.app";

export function LoginCard({ onLogin, isLoggedIn }: LoginCardProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Något gick fel");
      }

      if (isRegister) {
        setSuccess("Konto skapat! Du kan nu logga in.");
        setIsRegister(false);
        setPassword("");
      } else {
        onLogin(data.access_token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
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
        {isRegister ? (
          <UserPlus className="h-5 w-5 text-primary" />
        ) : (
          <LogIn className="h-5 w-5 text-primary" />
        )}
        <h2 className="text-lg font-semibold">
          {isRegister ? "Skapa konto" : "Logga in"}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ange användarnamn"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ange lösenord"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}

        {success && (
          <p className="text-sm text-primary animate-fade-in">{success}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading || !username || !password}
          variant="glow"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isRegister ? "Skapar konto..." : "Loggar in..."}
            </>
          ) : (
            <>
              {isRegister ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  Skapa konto
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Logga in
                </>
              )}
            </>
          )}
        </Button>

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setSuccess("");
          }}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {isRegister
            ? "Har redan ett konto? Logga in"
            : "Inget konto? Skapa ett här"}
        </button>
      </div>
    </div>
  );
}