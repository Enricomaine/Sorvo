import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo, useState } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const queryEmail = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email") || "";
  }, [location.search]);

  useEffect(() => {
    const stateEmail = (location.state as { email?: string } | null)?.email || "";
    setEmail(stateEmail || queryEmail);
  }, [location.state, queryEmail]);

  const handleSubmit = () => {
    // TODO: call backend to send reset email
    toast({
      title: "Email enviado",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    });
    // navigate("/");
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-foreground">Esqueci minha senha</h1>
        <p className="text-muted-foreground mt-1">Informe seu e-mail para receber as instruções</p>
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Enviar</Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
