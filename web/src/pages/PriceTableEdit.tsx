import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { priceTables, PriceTable } from "../data/priceTables";
import { ItemPriceSelector, TableItemPrice } from "@/components/ui/item-price-selector";

const PriceTableEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [table, setTable] = useState<PriceTable | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [tableItems, setTableItems] = useState<TableItemPrice[]>([]);

  useEffect(() => {
    const found = priceTables.find((t) => t.id === id);
    setTable(found || null);
  }, [id]);

  useEffect(() => {
    if (table) {
      setName(table.name);
      setDescription(table.description || "");
      setStatus(table.active ? "active" : "inactive");
    }
  }, [table]);

  const handleSave = () => {
    // TODO: validate and send tableItems
    navigate("/tabelas-preco");
  };

  const handleCancel = () => navigate("/tabelas-preco");

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Editar tabela</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados da tabela de preço</p>
        </div>

        {table ? (
          <Card className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <ItemPriceSelector value={tableItems} onChange={setTableItems} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleCancel}>Cancelar</Button>
              <Button className="w-full sm:w-auto" onClick={handleSave}>Salvar</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">Tabela não encontrada</Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default PriceTableEdit;
