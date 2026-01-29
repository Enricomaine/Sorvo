import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  if (!isAuthenticated) {
    toast({
      title: "Não autorizado",
      description: "Faça login para utilizar esse recurso",
    });
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
