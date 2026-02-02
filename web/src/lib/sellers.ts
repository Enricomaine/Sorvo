import { getToken } from "./auth";

export interface SellerDTO {
  id: number;
  name: string;
  document: string | null;
  phone: string | null;
  active: boolean;
  person_type: "person" | "business";
  user?: { email: string } | null;
}

export async function fetchSellers(): Promise<SellerDTO[]> {
  const token = getToken();
  const res = await fetch("/api/v1/sellers", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar vendedores";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as SellerDTO[];
}

export async function fetchSeller(id: string | number): Promise<SellerDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/sellers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar vendedor";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as SellerDTO;
}

export interface UpsertSellerPayload {
  name: string;
  document: string | null;
  phone: string | null;
  person_type: "person" | "business";
  active: boolean;
  user_attributes?: { email: string; password?: string };
}

export async function updateSeller(id: string | number, payload: UpsertSellerPayload): Promise<SellerDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/sellers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ seller: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao salvar vendedor";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as SellerDTO;
}

export async function createSeller(payload: UpsertSellerPayload): Promise<SellerDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/sellers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ seller: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao criar vendedor";
    try {
      const data = await res.json();
      message = (data as any).error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as SellerDTO;
}
