import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchItems, ItemDTO } from "@/lib/items";
import { useToast } from "@/hooks/use-toast";
import { Edit, Filter, Plus } from "lucide-react";

const Items = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchItems()
      .then(setItems)
      .catch((err) => {
        toast({ title: "Erro", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [toast]);
  // Using only search for now, based on available ProductData fields

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((p) => {
      const matchesSearch = `${p.code} ${p.description}`.toLowerCase().includes(q);
      return matchesSearch;
    });
  }, [search, items]);

  const handleCreate = () => navigate("/itens/novo");
  const handleEdit = (id: string) => navigate(`/itens/${id}/editar`);

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Itens</h1>
            <p className="text-muted-foreground mt-1">Central dos itens</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Cadastrar item
          </Button>
        </div>

        <Card className="p-3 sm:p-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Buscar por nome ou descrição"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {filtered.map((p) => (
            <Card key={p.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{p.code}</div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {p.base_price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(p.id))}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">Nenhum item encontrado</Card>
          )}
        </div>

        {/* Table for >= sm */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-3 px-4 font-medium">Nome</th>
                <th className="py-3 px-4 font-medium">Descrição</th>
                <th className="py-3 px-4 font-medium">Unidade</th>
                <th className="py-3 px-4 font-medium">Preço</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium text-foreground">{p.code}</td>
                  <td className="py-3 px-4">{p.description}</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4">{p.base_price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(p.id))}>
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhum item encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default Items;
