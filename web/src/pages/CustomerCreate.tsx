import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCustomer } from "@/lib/customers";
import { useToast } from "@/hooks/use-toast";
import { onlyDigits, maskByPersonType, maxDigitsByPersonType } from "@/lib/utils";
import { ActiveToggle } from "@/components/ActiveToggle";

const CustomerCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState<"juridica" | "fisica">("juridica");
  const [active, setActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const person_type = segment === "juridica" ? "business" : "person";
      await createCustomer({
        name,
        document: onlyDigits(document) || null,
        phone: phone || null,
        person_type,
        active: active,
  user_attributes: { email, password: password || undefined },
      });
      toast({ title: "Cliente criado", description: "O cliente foi cadastrado com sucesso." });
      navigate("/clientes");
    } catch (err: any) {
      toast({ title: "Erro ao criar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/clientes");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cadastrar cliente</h1>
          <p className="text-muted-foreground mt-1">Preencha os dados do cliente</p>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
            </div>
            <div>
              <Label htmlFor="document">{segment === "juridica" ? "CNPJ" : "CPF"}</Label>
              <Input
                id="document"
                value={maskByPersonType(document, segment)}
                onChange={(e) => {
                  const raw = onlyDigits(e.target.value);
                  setDocument(raw.slice(0, maxDigitsByPersonType(segment)));
                }}
                inputMode="numeric"
                placeholder={segment === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
            </div>
            <div>
              <Label>Tipo pessoa</Label>
              <Select value={segment} onValueChange={(value) => setSegment(value as "juridica" | "fisica")}>
                <SelectTrigger>
                  <SelectValue placeholder="Segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juridica">Jurídica</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ActiveToggle checked={active} onChange={setActive} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>Cancelar</Button>
            <Button className="w-full sm:w-auto" onClick={handleSave} disabled={saving}>Salvar</Button>
          </div>
        </Card>
      </div>
    </AppSidebar>
  );
};

export default CustomerCreate;
