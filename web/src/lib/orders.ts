import { getToken } from "./auth";

export type OrderStatus = "pending" | "cancelled" | "delivered";

export interface OrderListDTO {
  id: number;
  customer_id: number;
  seller_id: number;
  status: OrderStatus;
  created_at: string;
  total_value: number;
  customer?: { trade_name: string };
}

export async function fetchOrders(): Promise<OrderListDTO[]> {
  const token = getToken();
  const res = await fetch("/api/v1/orders", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar pedidos";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as OrderListDTO[];
}

export interface OrderItemDTO {
  id: number;
  item_id: number;
  quantity: number;
  unit_price: number;
  item: {
    id: number;
    code: string;
    description: string;
  };
}

export interface OrderDetailDTO {
  id: number;
  customer_id: number;
  seller_id: number;
  status: OrderStatus;
  observation?: string | null;
  created_at: string;
  customer?: { trade_name: string };
  order_items: OrderItemDTO[];
}

export async function fetchOrder(id: string | number): Promise<OrderDetailDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/orders/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar pedido";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
  }
  return (await res.json()) as OrderDetailDTO;
}

export async function updateOrder(id: string | number, payload: Partial<{ status: OrderStatus; observation: string }>): Promise<OrderDetailDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ order: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao salvar pedido";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as OrderDetailDTO;
}
