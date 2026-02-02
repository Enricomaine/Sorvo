import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle } from "lucide-react";
import { fetchOrder, updateOrder, OrderDetailDTO, OrderStatus } from "@/lib/orders";

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
  delivered: {
    label: "Entregue",
    icon: CheckCircle,
    color: "bg-success/10 text-success",
  },
  cancelled: {
    label: "Cancelado",
    icon: Clock,
    color: "bg-destructive/10 text-destructive",
  },
};

function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchOrder(id)
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch((err) => {
        toast({ title: "Erro", description: err?.message || "Falha ao carregar pedido", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  const subtotal = useMemo(() => {
    if (!order) return 0;
    return order.order_items.reduce((acc, it) => acc + Number(it.unit_price || 0) * Number(it.quantity || 0), 0);
  }, [order]);

  const discountInputDefault = "";
  const [discountInput, setDiscountInput] = useState<string>(discountInputDefault);
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const normalizedDiscount = discountInput.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
  const parsedDiscount = normalizedDiscount.length ? Number(normalizedDiscount) : 0;
  const discountValue = discountType === "percent" ? subtotal * (parsedDiscount / 100) : parsedDiscount;
  const total = Math.max(0, subtotal - discountValue);

  const statusOrder = statusConfig[status];
  const StatusIcon = statusOrder.icon;

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pedido {order?.id}</h1>
            <p className="text-muted-foreground mt-1">{order ? `Criado em ${new Date(order.created_at).toLocaleDateString("pt-BR")}` : ""}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
        {/* <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pedido {order.id}</h1>
            <p className="text-muted-foreground mt-1">Criado em {order.date}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <Button className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
          </div>
        </div> */}

        {/* Status */}
        {loading && <Card className="p-6 text-center">Carregando...</Card>}
        {!loading && order && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Badge className={`${statusOrder.color} text-base px-4 py-2`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {statusOrder.label}
            </Badge>
          </div>
        )}

        {/* Customer */}
        {order && (
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Cliente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="text-foreground font-medium">{order.customer?.trade_name || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Código</p>
              <p className="text-foreground font-medium">{order.customer_id}</p>
            </div>
          </div>
        </Card>
        )}

        {/* Items group */}
        {order && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Itens do pedido</h2>
            <Badge variant="secondary">{order.order_items.length} itens</Badge>
          </div>
          {/* Mobile: cards */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {order.order_items.map((it) => (
              <Card key={it.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="text-foreground font-semibold">{it.item?.description}</p>
                    <p className="text-xs text-muted-foreground">{it.item?.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Qtd</p>
                    <p className="text-foreground font-medium">{it.quantity}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preço</span>
                  <span className="text-foreground">{Number(it.unit_price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{(Number(it.unit_price || 0) * Number(it.quantity || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead className="py-4">Item</TableHead>
                  <TableHead className="py-4 text-center">Quantidade</TableHead>
                  <TableHead className="py-4">Preço</TableHead>
                  <TableHead className="py-4">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((it) => (
                  <TableRow key={it.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground py-4">{it.item?.description}</TableCell>
                    <TableCell className="text-center py-4">{it.quantity}</TableCell>
                    <TableCell className="py-4">{Number(it.unit_price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                    <TableCell className="py-4">{(Number(it.unit_price || 0) * Number(it.quantity || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        )}

        {/* Totals */}
        {order && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-foreground font-medium">{freight.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div> */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desconto</span>
                <div className="flex items-center gap-2">
                  <Input
                    value={discountInput}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const sanitized = raw.replace(/[^0-9,]/g, "");
                      setDiscountInput(sanitized);
                    }}
                    placeholder={discountType === "percent" ? "0,00" : "0,00"}
                    className="h-8 w-28 text-right"
                  />
                  <Select value={discountType} onValueChange={(v) => setDiscountType(v as any)}>
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Valor (R$)</SelectItem>
                      <SelectItem value="percent">Percentual (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Aplicado</span>
                <span>
                  {discountType === "percent"
                    ? `${(parsedDiscount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}% (${discountValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`
                    : discountValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-foreground font-bold">{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-sm text-muted-foreground">Altere o status</span>
              <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Alterar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
          </div>
          </div>
        </Card>
        )}

        {/* Footer actions */}
        {order && (
          <div className="mt-6">
            <Button
              className="gap-2 w-full"
              disabled={saving}
              onClick={async () => {
                if (!id) return;
                setSaving(true);
                try {
                  const updated = await updateOrder(id, { status });
                  setOrder(updated);
                  toast({ title: "Pedido salvo", description: "As alterações foram salvas com sucesso." });
                  navigate("/dashboard");
                } catch (err: any) {
                  toast({ title: "Erro ao salvar", description: err?.message || "Falha ao salvar pedido", variant: "destructive" });
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar
            </Button>
          </div>
        )}
      </div>
    </AppSidebar>
  );
}

export default OrderView;
