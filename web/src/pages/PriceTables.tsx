import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { priceTables, PriceTable } from "../data/priceTables";
import { Edit, Filter, Plus } from "lucide-react";

const PriceTables = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return priceTables.filter((t) => {
      const matchesSearch = `${t.name} ${t.description || ""}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || (status === "active" ? t.active : !t.active);
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const handleCreate = () => navigate("/tabelas-preco/nova");
  const handleEdit = (id: string) => navigate(`/tabelas-preco/${id}/editar`);

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tabelas de preço</h1>
            <p className="text-muted-foreground mt-1">Central das tabelas</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Cadastrar tabela
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
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filtros</span>
            </div>
          </div>
        </Card>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {filtered.map((t) => (
            <Card key={t.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{t.name}</div>
                  {t.description && (
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.description}</div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-foreground">{t.itemsCount} itens</span>
                    <span
                      className={
                        t.active
                          ? "inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5"
                          : "inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5"
                      }
                    >
                      {t.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(t.id)}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">Nenhuma tabela encontrada</Card>
          )}
        </div>

        {/* Table for >= sm */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-3 px-4 font-medium">Nome</th>
                <th className="py-3 px-4 font-medium">Descrição</th>
                <th className="py-3 px-4 font-medium">Itens</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Criada em</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium text-foreground">{t.name}</td>
                  <td className="py-3 px-4">{t.description || "-"}</td>
                  <td className="py-3 px-4">{t.itemsCount}</td>
                  <td className="py-3 px-4">
                    <span className={
                      t.active
                        ? "inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium"
                        : "inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-xs font-medium"
                    }>
                      {t.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(t.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(t.id)}>
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma tabela encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default PriceTables;
