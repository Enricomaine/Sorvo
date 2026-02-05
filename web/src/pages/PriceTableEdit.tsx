import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPriceTable, updatePriceTable, PriceTableDTO } from "@/lib/priceTables";
import { ItemPriceSelector, TableItemPrice } from "@/components/ui/item-price-selector";
import { useToast } from "@/hooks/use-toast";
import { ActiveToggle } from "@/components/ActiveToggle";

const PriceTableEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [table, setTable] = useState<PriceTableDTO | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState<boolean>(true);
  const [tableItems, setTableItems] = useState<TableItemPrice[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchPriceTable(id)
      .then(setTable)
      .catch((err) => toast({ title: "Erro", description: err.message, variant: "destructive" }));
  }, [id, toast]);

  useEffect(() => {
    if (table) {
      setName(table.observation || "");
      setDescription(table.description || "");
      setActive(!!table.active);
      setTableItems(
        (table.price_table_items || []).map((pti) => ({
          id: String(pti.item_id),
          name: pti.item ? `${pti.item.code} — ${pti.item.description}` : pti.item_id?.toString() || "",
          unit: "",
          basePrice: (pti.item?.base_price ?? pti.base_price) ?? undefined,
          price: (pti.final_price ?? pti.item?.base_price ?? pti.base_price) ?? 0,
        }))
      );
    }
  }, [table]);

  const handleSave = async () => {
    if (!id) return;
    if (!description.trim()) {
      toast({ title: "Descrição obrigatória", description: "Informe a descrição da tabela.", variant: "destructive" });
      return;
    }
    if (tableItems.length === 0) {
      toast({ title: "Itens obrigatórios", description: "Adicione ao menos um item.", variant: "destructive" });
      return;
    }
    try {
      await updatePriceTable(id, {
        description: description.trim(),
        observation: name || null,
        active: active,
        price_table_items_attributes: tableItems
          .filter((ti) => ti.id && !isNaN(Number(ti.id)))
          .map((ti) => ({
            item_id: Number(ti.id),
            base_price: ti.basePrice ?? null,
            final_price: ti.price ?? null,
          })),
      });
      toast({ title: "Tabela atualizada", description: "Alterações salvas." });
      navigate("/tabelas-preco");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
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
              <ActiveToggle checked={active} onChange={setActive} />
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
