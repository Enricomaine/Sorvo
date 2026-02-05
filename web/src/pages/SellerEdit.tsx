import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSeller, updateSeller, SellerDTO } from "@/lib/sellers";
import { useToast } from "@/hooks/use-toast";
import { onlyDigits, maskByPersonType, maxDigitsByPersonType } from "@/lib/utils";
import { ActiveToggle } from "@/components/ActiveToggle";

const SellerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [seller, setSeller] = useState<SellerDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [personType, setPersonType] = useState<"juridica" | "fisica">("juridica");
  const [active, setActive] = useState<boolean>(true);


  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchSeller(id)
      .then((data) => setSeller(data))
      .catch((err) => {
        toast({ title: "Erro", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  useEffect(() => {
    if (seller) {
      setName(seller.name || "");
      setDocument(onlyDigits(seller.document || ""));
      setEmail(seller.user?.email || "");
      setPhone(seller.phone || "");
      setPersonType(seller.person_type === "business" ? "juridica" : "fisica");
      setActive(!!seller.active);
    }
  }, [seller]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const person_type = personType === "juridica" ? "business" : "person";
      await updateSeller(id, {
        name,
        document: document || null,
        phone: phone || null,
        person_type,
        active: active,
        user_attributes: { email, password: password || undefined },
      });
      toast({ title: "Vendedor salvo", description: "As alterações foram aplicadas." });
      navigate("/vendedores");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/vendedores");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar vendedor</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do vendedor</p>
        </div>

        {loading ? (
          <Card className="p-6 text-center text-muted-foreground">Carregando...</Card>
        ) : seller ? (
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
              <ActiveToggle checked={active} onChange={setActive} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>Cancelar</Button>
              <Button className="w-full sm:w-auto" onClick={handleSave} disabled={saving}>Salvar</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">Vendedor não encontrado</Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default SellerEdit;
