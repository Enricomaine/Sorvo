import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [token, setToken] = useState("");

  const queryToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  useEffect(() => {
    const stateToken = (location.state as { token?: string } | null)?.token || "";
    setToken(stateToken || queryToken);
  }, [location.state, queryToken]);

  const handleSubmit = () => {
    if (!password || !confirm) {
      toast({ title: "Campos obrigatórios", description: "Informe e confirme a nova senha.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas diferentes", description: "As senhas informadas não conferem.", variant: "destructive" });
      return;
    }
    // TODO: call backend to reset password with token
    toast({ title: "Senha redefinida", description: "Você já pode entrar com sua nova senha." });
    navigate("/");
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-foreground">Recuperar senha</h1>
        <p className="text-muted-foreground mt-1">Defina uma nova senha para sua conta</p>
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Redefinir senha</Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
