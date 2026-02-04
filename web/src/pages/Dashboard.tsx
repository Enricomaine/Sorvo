import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchOrders, OrderListDTO } from "@/lib/orders";

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
  },
  cancelled: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: XCircle,
  },
  delivered: {
    label: "Entregue",
    variant: "default" as const,
    icon: CheckCircle,
  },
};

const Dashboard = () => {
  const [orders, setOrders] = useState<OrderListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar pedidos";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [toast]);

  const handleViewOrder = (orderId: number) => {
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
      title: "Pedidos Entregues",
      value: orders.filter((o) => o.status === "delivered").length.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pedidos Pendentes",
      value: orders.filter((o) => o.status === "pending").length.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Faturamento Total",
      value: `R$ ${orders
        .filter((o) => o.status === "delivered")
        .reduce((acc, o) => acc + o.total_value, 0)
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

        {/* Loading state */}
        {loading && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Carregando pedidos...</p>
          </Card>
        )}

        {/* Error state */}
        {error && !loading && (
          <Card className="p-6 text-center text-destructive">
            <p>{error}</p>
          </Card>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </Card>
        )}

        {/* Orders: mobile cards */}
        {!loading && !error && orders.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:hidden mb-8">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <div key={order.id} className="card-elevated p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pedido</p>
                      <p className="text-lg font-semibold text-foreground">#{order.id}</p>
                    </div>
                    <Badge
                      variant={status.variant}
                      className={`${
                        order.status === "delivered"
                          ? "bg-success/10 text-success"
                          : order.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : ""
                      }`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="mt-1 text-sm text-foreground">
                    {order.customer?.trade_name || "Cliente não informado"}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-medium text-foreground">
                      R$ {order.total_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewOrder(order.id)} 
                      className="hover:bg-accent"
                    >
                      <Eye className="h-4 w-4 mr-1" /> Ver
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Orders Table for >= sm */}
        {!loading && !error && orders.length > 0 && (
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
                          #{order.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-4">
                          {new Date(order.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-foreground py-4 hidden sm:table-cell">
                          {order.customer?.trade_name || "Cliente não informado"}
                        </TableCell>
                        <TableCell className="font-medium text-foreground py-4">
                          R$ {order.total_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={status.variant}
                            className={`${
                              order.status === "delivered"
                                ? "bg-success/10 text-success hover:bg-success/20"
                                : order.status === "pending"
                                ? "bg-warning/10 text-warning hover:bg-warning/20"
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
        )}
      </div>
    </AppSidebar>
  );
};

export default Dashboard;
