import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Printer, Clock, Package, CheckCircle,  } from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface OrderItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  date: string;
  status: OrderStatus;
  customer: {
    name: string;
    document: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-warning/10 text-warning",
  },
  processing: {
    label: "Processando",
    variant: "default" as const,
    icon: Package,
    color: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Concluído",
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

function getMockOrder(id?: string): OrderData {
  return {
    id: id || "12345",
    date: "31/12/2025",
    status: "pending",
    customer: {
      name: "Acme Ltda",
      document: "12.345.678/0001-99",
      email: "compras@acme.com",
      phone: "(11) 99999-0000",
    },
    items: [
      { id: "p1", name: "Produto A", unit: "un", quantity: 2, price: 35.5 },
      { id: "p2", name: "Produto B", unit: "cx", quantity: 1, price: 120 },
      { id: "p3", name: "Produto C", unit: "kg", quantity: 3, price: 19.9 },
    ]
  };
}

function OrderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const order = useMemo(() => getMockOrder(id), [id]);
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const subtotal = order.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const freight = 0;
  const [discountInput, setDiscountInput] = useState<string>("");
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const normalizedDiscount = discountInput.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
  const parsedDiscount = normalizedDiscount.length ? Number(normalizedDiscount) : 0;
  const discountValue = discountType === "percent" ? subtotal * (parsedDiscount / 100) : parsedDiscount;
  const total = Math.max(0, subtotal + freight - discountValue);

  const statusOrder = statusConfig[order.status]
  const StatusIcon = statusOrder.icon

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pedido {order.id}</h1>
            <p className="text-muted-foreground mt-1">Criado em {order.date}</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Badge className={`${statusOrder.color} text-base px-4 py-2`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {statusOrder.label}
          </Badge>
        </div>

        {/* Customer */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Cliente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="text-foreground font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Documento</p>
              <p className="text-foreground font-medium">{order.customer.document}</p>
            </div>
            <div>
              <p className="text-muted-foreground">E-mail</p>
              <p className="text-foreground font-medium">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="text-foreground font-medium">{order.customer.phone}</p>
            </div>
          </div>
        </Card>

        {/* Items group */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Itens do pedido</h2>
            <Badge variant="secondary">{order.items.length} itens</Badge>
          </div>
          {/* Mobile: cards */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {order.items.map((it) => (
              <Card key={it.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="text-foreground font-semibold">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Qtd</p>
                    <p className="text-foreground font-medium">{it.quantity}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preço</span>
                  <span className="text-foreground">{it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{(it.price * it.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
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
                  <TableHead className="py-4">Unidade</TableHead>
                  <TableHead className="py-4 text-center">Quantidade</TableHead>
                  <TableHead className="py-4">Preço</TableHead>
                  <TableHead className="py-4">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((it) => (
                  <TableRow key={it.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground py-4">{it.name}</TableCell>
                    <TableCell className="text-muted-foreground py-4">{it.unit}</TableCell>
                    <TableCell className="text-center py-4">{it.quantity}</TableCell>
                    <TableCell className="py-4">{it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                    <TableCell className="py-4">{(it.price * it.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Totals */}
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
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
          </div>
          </div>
        </Card>

        {/* Footer actions */}
        <div className="mt-6">
          <Button
            className="gap-2 w-full"
            onClick={() => {
              toast({ title: "Pedido salvo", description: "As alterações foram salvas com sucesso." });
              navigate("/dashboard");
            }}
          >
            Salvar
          </Button>
        </div>
      </div>
    </AppSidebar>
  );
}

export default OrderView;
