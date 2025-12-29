import { useMemo, useState } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { products, ProductData } from "@/data/products";
import { X, Plus } from "lucide-react";

export interface TableItemPrice {
  id: string; // product id
  name: string;
  unit: string;
  basePrice: number;
  price: number; // overridden price in table
}

interface ItemPriceSelectorProps {
  value: TableItemPrice[];
  onChange: (items: TableItemPrice[]) => void;
}

export function ItemPriceSelector({ value, onChange }: ItemPriceSelectorProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [query]);

  const alreadySelected = new Set(value.map((v) => v.id));
  const addSelected = () => {
    if (!selectedId) return;
    if (alreadySelected.has(selectedId)) return;
    const prod = products.find((p) => p.id === selectedId);
    if (!prod) return;
    const item: TableItemPrice = {
      id: prod.id,
      name: prod.name,
      unit: prod.unit,
      basePrice: prod.price,
      price: prod.price,
    };
    onChange([...value, item]);
    setSelectedId("");
  };

  const removeItem = (id: string) => {
    onChange(value.filter((v) => v.id !== id));
  };

  const updatePrice = (id: string, priceStr: string) => {
    const parsed = Number(priceStr.replace(/[^0-9.,]/g, "").replace(/,/g, "."));
    onChange(value.map((v) => (v.id === id ? { ...v, price: isNaN(parsed) ? v.price : parsed } : v)));
  };

  return (
    <div className="space-y-3">
      <Label>Itens da tabela</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Buscar itens"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Selecione um item</option>
          {filtered.filter((p) => !alreadySelected.has(p.id)).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button onClick={addSelected} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {value.map((v) => (
            <Card key={v.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{v.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">Unidade: {v.unit}</div>
                  <div className="text-xs text-muted-foreground">Preço base: {v.basePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                </div>
                <button className="text-muted-foreground" onClick={() => removeItem(v.id)} aria-label="Remover">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3">
                <Label className="text-xs">Preço na tabela</Label>
                <Input
                  value={String(v.price)}
                  onChange={(e) => updatePrice(v.id, e.target.value)}
                  placeholder="Ex: 19,90"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
