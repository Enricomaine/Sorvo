import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Clock, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchOrder, OrderDetailDTO } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
  delivered: {
    label: "Entregue",
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-success/10 text-success",
  },
  cancelled: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: Clock,
    color: "bg-destructive/10 text-destructive",
  },
};

export default function OrderReadOnly() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchOrder(id)
      .then(setOrder)
      .catch((err) => {
        const msg = err?.message || "Falha ao carregar pedido";
        setError(msg);
        toast({ title: "Erro", description: msg, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  const subtotal = useMemo(() => {
    if (!order) return 0;
    return order.order_items.reduce((acc, it) => acc + Number(it.unit_price || 0) * Number(it.quantity || 0), 0);
  }, [order]);

  const statusOrder = order ? statusConfig[order.status] : statusConfig.pending;
  const StatusIcon = statusOrder.icon;

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pedido {order?.id}</h1>
            <p className="text-muted-foreground mt-1">{order ? `Criado em ${new Date(order.created_at).toLocaleDateString("pt-BR")}` : ""}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>

        {loading && <Card className="p-6 text-center">Carregando pedido...</Card>}
        {error && !loading && <Card className="p-6 text-center text-destructive">{error}</Card>}

        {!loading && !error && order && (
          <>
            {/* Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <Badge className={`${statusOrder.color} text-base px-4 py-2`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusOrder.label}
              </Badge>
            </div>

            {/* Cliente */}
            <Card className="p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Cliente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome fantasia</p>
                  <p className="font-medium">{order.customer?.trade_name || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Código</p>
                  <p className="font-medium">{order.customer_id}</p>
                </div>
              </div>
            </Card>

            {/* Itens */}
            <Card className="p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Itens do pedido</h2>
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items.map((it) => (
                      <TableRow key={it.id}>
                        <TableCell className="font-medium">{it.item?.description}</TableCell>
                        <TableCell className="text-center">{it.quantity}</TableCell>
                        <TableCell>{Number(it.unit_price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                        <TableCell>{(Number(it.unit_price || 0) * Number(it.quantity || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {order.order_items.map((it) => (
                  <Card key={it.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Item</p>
                        <p className="font-semibold">{it.item?.description}</p>
                        <p className="text-xs text-muted-foreground">{it.item?.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Qtd</p>
                        <p className="font-medium">{it.quantity}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Preço</span>
                      <span>{Number(it.unit_price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{(Number(it.unit_price || 0) * Number(it.quantity || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Totais */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
            </Card>

            {/* Footer: copy items to cart - disabled for now without product mapping */}
            {/* <div className="mt-6">
              <Button className="w-full" onClick={() => navigate("/marketplace")}>Copiar pedido</Button>
            </div> */}
          </>
        )}
      </div>
    </AppSidebar>
  );
}
