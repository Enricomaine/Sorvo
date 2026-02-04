import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Filter, Plus, Phone, Mail, IdCard } from "lucide-react";
import { fetchSellers, SellerDTO } from "@/lib/sellers";
import { useToast } from "@/hooks/use-toast";

const Sellers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellers, setSellers] = useState<SellerDTO[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchSellers()
      .then((data) => {
        if (!active) return;
        setSellers(data);
      })
      .catch((err: any) => {
        if (!active) return;
        setError(err?.message || "Falha ao carregar vendedores");
        toast({ title: "Erro", description: err?.message || "Falha ao carregar vendedores", variant: "destructive" });
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    return sellers.filter((s) => {
      const email = s.user?.email || "";
      const matchesSearch = `${s.name} ${s.document || ""} ${email} ${s.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusValue = s.active ? "ativo" : "inativo";
      const matchesStatus = status === "all" || status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [sellers, search, status]);

  const handleCreate = () => navigate("/vendedores/novo");
  const handleEdit = (id: string) => navigate(`/vendedores/${id}/editar`);

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Vendedores</h1>
            <p className="text-muted-foreground mt-1">Central dos vendedores</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Cadastrar vendedor
          </Button>
        </div>

        <Card className="p-3 sm:p-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Buscar por nome, documento, e-mail ou telefone"
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filtros</span>
            </div>
          </div>
        </Card>
        {loading && <Card className="p-6 text-center">Carregando vendedores...</Card>}
        {error && !loading && <Card className="p-6 text-center text-destructive">{error}</Card>}

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {!loading && !error && filtered.map((s) => (
            <Card key={s.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{s.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><IdCard className="h-3 w-3" />{s.document || "—"}</span>
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{s.user?.email || "—"}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone || "—"}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={
                        s.active
                          ? "text-xs inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5"
                          : "text-xs inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5"
                      }
                    >
                      {s.active ? "ativo" : "inativo"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(s.id))}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {!loading && !error && filtered.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">Nenhum vendedor encontrado</Card>
          )}
        </div>

        {/* Table for >= sm */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-3 px-4 font-medium">Nome</th>
                <th className="py-3 px-4 font-medium">Documento</th>
                <th className="py-3 px-4 font-medium">E-mail</th>
                <th className="py-3 px-4 font-medium">Telefone</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && filtered.map((s) => (
                <tr key={s.id} className="border-t hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 px-4">{s.document || "—"}</td>
                  <td className="py-3 px-4">{s.user?.email || "—"}</td>
                  <td className="py-3 px-4">{s.phone || "—"}</td>
                  <td className="py-3 px-4">
                    <span className={
                      s.active
                        ? "inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium"
                        : "inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-xs font-medium"
                    }>
                      {s.active ? "ativo" : "inativo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(s.id))}>
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhum vendedor encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default Sellers;
