import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, OrderListDTO } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";

export default function MyOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchOrders()
      .then((data) => { if (active) setOrders(data); })
      .catch((err) => {
        if (!active) return;
        const msg = err?.message || "Falha ao carregar pedidos";
        setError(msg);
        toast({ title: "Erro", description: msg, variant: "destructive" });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [toast]);

  const formatted = useMemo(() => orders.map((o) => ({
    id: String(o.id),
    customer: o.customer?.trade_name || "—",
    date: new Date(o.created_at).toLocaleDateString("pt-BR"),
    total: o.total_value || 0,
    status: o.status,
  })), [orders]);

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Meus pedidos</h1>
        </div>

        {loading && <Card className="p-6 text-center">Carregando pedidos...</Card>}
        {error && !loading && <Card className="p-6 text-center text-destructive">{error}</Card>}

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {!loading && !error && formatted.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Pedido {o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.customer} • {o.date}</div>
                </div>
                <div className="text-right font-bold">
                  {o.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={() => navigate(`/meus-pedidos/${o.id}`)}>Ver detalhes</Button>
              </div>
            </Card>
          ))}
          {!loading && !error && formatted.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">Nenhum pedido encontrado</Card>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && !error && formatted.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>#{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell className="text-right">{o.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => navigate(`/meus-pedidos/${o.id}`)}>Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !error && formatted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum pedido encontrado</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppSidebar>
  );
}
