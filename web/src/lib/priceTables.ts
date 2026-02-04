import { getToken } from "./auth";

export interface PriceTableItemDTO {
  id?: number;
  item_id: number;
  base_price?: number | null;
  percentage?: number | null;
  final_price?: number | null;
  item?: {
    id: number;
    code: string;
    description: string;
    base_price: number | null;
  };
}

export interface PriceTableDTO {
  id: number;
  description: string;
  observation?: string | null;
  active: boolean;
  created_at: string;
  price_table_items: PriceTableItemDTO[];
}

export async function fetchPriceTables(): Promise<PriceTableDTO[]> {
  const token = getToken();
  const res = await fetch("/api/v1/price_tables", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar tabelas";
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  return (await res.json()) as PriceTableDTO[];
}

export async function fetchPriceTable(id: number | string): Promise<PriceTableDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/price_tables/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar tabela";
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  return (await res.json()) as PriceTableDTO;
}

export interface SavePriceTablePayload {
  description: string;
  observation?: string | null;
  active?: boolean;
  price_table_items_attributes: Array<{
    item_id: number;
    base_price?: number | null;
    percentage?: number | null;
    final_price?: number | null;
  }>;
}

export async function createPriceTable(payload: SavePriceTablePayload): Promise<PriceTableDTO> {
  const token = getToken();
  const res = await fetch("/api/v1/price_tables", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ price_table: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao criar tabela";
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  return (await res.json()) as PriceTableDTO;
}

export async function updatePriceTable(id: number | string, payload: SavePriceTablePayload): Promise<PriceTableDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/price_tables/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ price_table: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao atualizar tabela";
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
  return (await res.json()) as PriceTableDTO;
}

export async function deletePriceTable(id: number | string): Promise<void> {
  const token = getToken();
  const res = await fetch(`/api/v1/price_tables/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao excluir tabela";
    try { const data = await res.json(); message = data.error || message; } catch {}
    throw new Error(message);
  }
}