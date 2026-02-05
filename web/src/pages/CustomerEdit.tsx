import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCustomer, updateCustomer, CustomerDTO } from "@/lib/customers";
import { useToast } from "@/hooks/use-toast";
import { onlyDigits, maskByPersonType, maxDigitsByPersonType } from "@/lib/utils";
import { ActiveToggle } from "@/components/ActiveToggle";

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCustomer(id)
      .then((data) => setCustomer(data))
      .catch((err) => {
        toast({ title: "Erro", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [personType, setPersonType] = useState<"juridica" | "fisica">("juridica");
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setDocument(onlyDigits(customer.document || ""));
      setEmail(customer.user?.email || "");
      setPhone(customer.phone || "");
      setPersonType(customer.person_type === "business" ? "juridica" : "fisica");
      setActive(!!customer.active);
    }
  }, [customer]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const person_type = personType === "juridica" ? "business" : "person";
      await updateCustomer(id, {
        name,
        document: onlyDigits(document) || null,
        phone: phone || null,
        person_type,
        active: active,
        user_attributes: { email, password: password || undefined },
      });
      toast({ title: "Cliente salvo", description: "As alterações foram aplicadas." });
      navigate("/clientes");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/clientes");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar cliente</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do cliente</p>
        </div>

        {loading ? (
          <Card className="p-6 text-center text-muted-foreground">Carregando...</Card>
        ) : customer ? (
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="document">{personType === "juridica" ? "CNPJ" : "CPF"}</Label>
                <Input
                  id="document"
                  value={maskByPersonType(document, personType)}
                  onChange={(e) => {
                    const raw = onlyDigits(e.target.value);
                    setDocument(raw.slice(0, maxDigitsByPersonType(personType)));
                  }}
                  inputMode="numeric"
                  placeholder={personType === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Tipo pessoa</Label>
                <Select value={personType} onValueChange={(value) => setPersonType(value as "juridica" | "fisica")}>
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
        ) : (
          <Card className="p-6 text-center text-muted-foreground">Cliente não encontrado</Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default CustomerEdit;
