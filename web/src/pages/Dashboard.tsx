import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const mockOrders: Order[] = [
  {
    id: "PED-001",
    date: "28/12/2024",
    customer: "Distribuidora ABC",
    items: 15,
    total: 4520.0,
    status: "completed",
  },
  {
    id: "PED-002",
    date: "28/12/2024",
    customer: "Mercado Central",
    items: 8,
    total: 1890.5,
    status: "processing",
  },
  {
    id: "PED-003",
    date: "27/12/2024",
    customer: "Supermercado Bom Preço",
    items: 22,
    total: 7830.0,
    status: "pending",
  },
  {
    id: "PED-004",
    date: "27/12/2024",
    customer: "Atacado Mineiro",
    items: 45,
    total: 12450.0,
    status: "completed",
  },
  {
    id: "PED-005",
    date: "26/12/2024",
    customer: "Loja do João",
    items: 5,
    total: 890.0,
    status: "cancelled",
  },
];

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
  },
  processing: {
    label: "Processando",
    variant: "default" as const,
    icon: Package,
  },
  completed: {
    label: "Concluído",
    variant: "default" as const,
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: Clock,
  },
};

const Dashboard = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`/pedido/${orderId}`);
  };

  const stats = [
    {
      title: "Total de Pedidos",
      value: orders.length.toString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-accent",
    },
    {
      title: "Pedidos Concluídos",
      value: orders.filter((o) => o.status === "completed").length.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Em Processamento",
      value: orders.filter((o) => o.status === "processing").length.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Faturamento Total",
      value: `R$ ${orders
        .filter((o) => o.status === "completed")
        .reduce((acc, o) => acc + o.total, 0)
        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-accent",
    },
  ];

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Visualize e gerencie seus pedidos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="card-elevated p-5 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders: mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden mb-8">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <div key={order.id} className="card-elevated p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido</p>
                    <p className="text-lg font-semibold text-foreground">{order.id}</p>
                  </div>
                  <Badge
                    variant={status.variant}
                    className={`${
                      order.status === "completed"
                        ? "bg-success/10 text-success"
                        : order.status === "processing"
                        ? "bg-primary/10 text-primary"
                        : ""
                    }`}
                  >
                    {status.label}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{order.date}</div>
                <div className="mt-1 text-sm text-foreground">{order.customer}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-medium text-foreground">R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)} className="hover:bg-accent">
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders Table for >= sm */}
        <div className="card-elevated overflow-hidden hidden sm:block">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-foreground">
              Pedidos Recentes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead className="py-4">Pedido</TableHead>
                  <TableHead className="py-4">Data</TableHead>
                  <TableHead className="py-4 hidden sm:table-cell">Cliente</TableHead>
                  <TableHead className="py-4 text-center hidden md:table-cell">Itens</TableHead>
                  <TableHead className="py-4">Total</TableHead>
                  <TableHead className="py-4">Status</TableHead>
                  <TableHead className="py-4 text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-semibold text-foreground py-4">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-4">
                        {order.date}
                      </TableCell>
                      <TableCell className="text-foreground py-4 hidden sm:table-cell">
                        {order.customer}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground py-4 hidden md:table-cell">
                        {order.items}
                      </TableCell>
                      <TableCell className="font-medium text-foreground py-4">
                        R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={status.variant}
                          className={`${
                            order.status === "completed"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : order.status === "processing"
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : ""
                          }`}
                        >
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                          className="hover:bg-accent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Ver</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppSidebar>
  );
};

export default Dashboard;
