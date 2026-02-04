import { ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  allowRoles?: Array<"admin" | "seller" | "customer">;
}

export default function ProtectedRoute({ children, allowRoles }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const role = useMemo(() => {
    if (!token) return undefined;
    try {
    const payloadBase64Url = token.split(".")[1];
    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice(0, (4 - (base64.length % 4)) % 4);
    const payloadJson = JSON.parse(atob(padded));
      return payloadJson?.role as string | undefined;
    } catch {
      return undefined;
    }
  }, [token]);

  const tokenInStorage = typeof window !== "undefined" ? localStorage.getItem("sorvo_token") : null;

  if (!isAuthenticated && !tokenInStorage) {
    toast({
      title: "Não autorizado",
      description: "Faça login para utilizar esse recurso",
    });
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowRoles && role && !allowRoles.includes(role as any)) {
    toast({
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar esta página.",
      variant: "destructive",
    });
    return (
      <Navigate
        to={role === "customer" ? "/marketplace" : "/dashboard"}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
