import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { getToken, setToken as saveToken, clearToken as dropToken } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) {
      saveToken(t);
    } else {
      dropToken();
    }
  };

  const logout = () => setToken(null);

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, setToken, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
