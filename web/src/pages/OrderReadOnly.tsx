import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Package, CheckCircle,  } from "lucide-react";

function getMockOrder(id?: string) {
  return {
    id: id || "12345",
    date: "31/12/2025",
    status: "completed" as const,
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
    ],
  };
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

const statusOrder = statusConfig[getMockOrder().status]
const StatusIcon = statusOrder.icon

export default function OrderReadOnly() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getMockOrder(id);

  const subtotal = order.items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pedido {order.id}</h1>
            <p className="text-muted-foreground mt-1">Criado em {order.date}</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>

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
              <p className="text-muted-foreground">Nome</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Documento</p>
              <p className="font-medium">{order.customer.document}</p>
            </div>
            <div>
              <p className="text-muted-foreground">E-mail</p>
              <p className="font-medium">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">{order.customer.phone}</p>
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
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.name}</TableCell>
                    <TableCell className="text-muted-foreground">{it.unit}</TableCell>
                    <TableCell className="text-center">{it.quantity}</TableCell>
                    <TableCell>{it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                    <TableCell>{(it.price * it.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {order.items.map((it) => (
              <Card key={it.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Qtd</p>
                    <p className="font-medium">{it.quantity}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Preço</span>
                  <span>{it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{(it.price * it.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
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
      </div>
    </AppSidebar>
  );
}
