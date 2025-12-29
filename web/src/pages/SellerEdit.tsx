import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { sellers, SellerData } from "../data/sellers";

const SellerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seller, setSeller] = useState<SellerData | null>(null);

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("ativo");

  useEffect(() => {
    const found = sellers.find((s) => s.id === id);
    setSeller(found || null);
  }, [id]);

  useEffect(() => {
    if (seller) {
      setName(seller.name);
      setDocument(seller.document);
      setEmail(seller.email);
      setPhone(seller.phone);
      setRegion(seller.region);
      setStatus(seller.status);
    }
  }, [seller]);

  const handleSave = () => {
    navigate("/vendedores");
  };

  const handleCancel = () => navigate("/vendedores");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar vendedor</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do vendedor</p>
        </div>

        {seller ? (
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="document">Documento</Label>
                <Input id="document" value={document} onChange={(e) => setDocument(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="region">Região</Label>
                <Input id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>Cancelar</Button>
              <Button className="w-full sm:w-auto" onClick={handleSave}>Salvar</Button>
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
