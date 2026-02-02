import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/auth";

export default function FirstAccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const emailFromState = (location.state as any)?.email || new URLSearchParams(location.search).get("email") || "";
  const queryToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email] = useState(emailFromState);
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken(queryToken);
  }, [queryToken]);

  const valid = password.length >= 8 && password === confirm;

  const onSubmit = async () => {
    if (!valid) return;
    if (!token) {
      toast({ title: "Token inválido", description: "O link/token de primeiro acesso é inválido ou ausente.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      toast({ title: "Senha definida", description: "Sua senha foi criada com sucesso." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Erro ao definir senha", description: err?.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppSidebar>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold">Primeiro acesso</h1>
            <p className="text-sm text-muted-foreground">Defina sua senha para acessar o sistema.</p>
          </div>

          {email && (
            <div className="text-sm text-muted-foreground text-center">Conta: <span className="font-medium text-foreground">{email}</span></div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Nova senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Confirmar senha</label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            A senha deve ter pelo menos 8 caracteres.
          </div>
          {!token && (
            <div className="text-xs text-destructive">
              Link sem token. Acesse via o link de e-mail de primeiro acesso.
            </div>
          )}

          <Button className="w-full" disabled={!valid || submitting} onClick={onSubmit}>
            {submitting ? "Salvando..." : "Definir senha"}
          </Button>

          <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>Voltar ao login</Button>
        </Card>
      </div>
    </AppSidebar>
  );
}
