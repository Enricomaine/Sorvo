import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrderListItem {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const mockOrders: OrderListItem[] = [
  { id: "12345", customer: "Acme Ltda", date: "31/12/2025", total: 355.4, status: "completed" },
  { id: "12346", customer: "Beta Ind.", date: "30/12/2025", total: 210.0, status: "processing" },
  { id: "12347", customer: "Gamma SA", date: "29/12/2025", total: 99.9, status: "pending" },
];

export default function MyOrders() {
  const navigate = useNavigate();

  return (
    <AppSidebar>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Meus pedidos</h1>
        </div>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {mockOrders.map((o) => (
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
              {mockOrders.map((o) => (
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
            </TableBody>
          </Table>
        </div>
      </div>
    </AppSidebar>
  );
}
