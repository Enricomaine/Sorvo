import { getToken } from "./auth";

export interface ItemDTO {
  id: number;
  code: string;
  description: string;
  observation?: string | null;
  base_price?: number | null;
  active: boolean;
  main_image_url?: string | null;
}

export async function fetchItems(): Promise<ItemDTO[]> {
  const token = getToken();
  const res = await fetch("/api/v1/items", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar itens";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDTO[];
}