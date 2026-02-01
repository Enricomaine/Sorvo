import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Edit, Filter, Plus, Phone, Mail, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCustomers, CustomerDTO } from "@/lib/customers";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchCustomers()
      .then((data) => {
        if (!active) return;
        setCustomers(data);
      })
      .catch((err: any) => {
        if (!active) return;
        setError(err?.message || "Falha ao carregar clientes");
        toast({ title: "Erro", description: err?.message || "Falha ao carregar clientes", variant: "destructive" });
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
    return customers.filter((c) => {
      const email = c.user?.username || "";
      const matchesSearch = `${c.name} ${c.document || ""} ${email}`.toLowerCase().includes(search.toLowerCase());
      // Segment not available from backend yet; keep filter as 'all'
      const matchesSegment = segment === "all";
      const statusValue = c.active ? "ativo" : "inativo";
      const matchesStatus = status === "all" || status === statusValue;
      return matchesSearch && matchesSegment && matchesStatus;
    });
  }, [customers, search, segment, status]);

  const handleCreate = () => {
    // In a real app, navigate to customer create form
    navigate("/clientes/novo");
  };

  const handleEdit = (id: string) => {
    // In a real app, navigate to customer edit form
    navigate(`/clientes/${id}/editar`);
  };

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">Central dos clientes</p>
          </div>
          <Button onClick={handleCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Cadastrar cliente
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Input
                placeholder="Buscar por nome, documento ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-3"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos segmentos</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="atacado">Atacado</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                </SelectContent>
              </Select>
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

        {loading && <Card className="p-6 text-center">Carregando clientes...</Card>}
        {error && !loading && <Card className="p-6 text-center text-destructive">{error}</Card>}

        {/* List: mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {!loading && !error && filtered.map((c) => (
            <Card key={c.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{c.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><IdCard className="h-3 w-3" />{c.document || "—"}</span>
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{c.user?.username || "—"}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone || "—"}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {/* Segment not provided; hide badge or show placeholder */}
                    {/* <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-muted text-foreground">{c.segment}</span> */}
                    <span
                      className={
                        c.active
                          ? "text-xs inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5"
                          : "text-xs inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5"
                      }
                    >
                      {c.active ? "ativo" : "inativo"}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(c.id))} aria-label={`Editar ${c.name}`}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {!loading && !error && filtered.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">Nenhum cliente encontrado</Card>
          )}
        </div>

        {/* List: table for >= sm */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-3 px-4 font-medium">Nome</th>
                <th className="py-3 px-4 font-medium">Documento</th>
                <th className="py-3 px-4 font-medium">E-mail</th>
                <th className="py-3 px-4 font-medium">Telefone</th>
                <th className="py-3 px-4 font-medium">Segmento</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && filtered.map((c) => (
                <tr key={c.id} className="border-t hover:bg-muted/40">
                  <td className="py-3 px-4 font-medium text-foreground">{c.name}</td>
                  <td className="py-3 px-4">{c.document}</td>
                  <td className="py-3 px-4">{c.user?.username || "—"}</td>
                  <td className="py-3 px-4">{c.phone || "—"}</td>
                  <td className="py-3 px-4 capitalize">{/* segment */}</td>
                  <td className="py-3 px-4">
                    <span className={
                      c.active
                        ? "inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium"
                        : "inline-flex items-center rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-xs font-medium"
                    }>
                      {c.active ? "ativo" : "inativo"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEdit(String(c.id))}>
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default Customers;
