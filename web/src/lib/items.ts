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

export interface CreateItemPayload {
  code: string;
  description: string;
  observation?: string | null;
  base_price: number;
  active?: boolean;
  main_image?: File;
  images?: File[];
}

export async function createItem(payload: CreateItemPayload): Promise<ItemDTO> {
  const token = getToken();
  const fd = new FormData();
  fd.append("item[code]", payload.code);
  fd.append("item[description]", payload.description);
  if (payload.observation) fd.append("item[observation]", payload.observation);
  fd.append("item[base_price]", String(payload.base_price));
  fd.append("item[active]", String(payload.active ?? true));
  if (payload.main_image) {
    fd.append("item[main_image]", payload.main_image);
  }
  if (payload.images && payload.images.length) {
    payload.images.forEach((file) => fd.append("item[images]", file));
  }

  const res = await fetch("/api/v1/items", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
  });
  if (!res.ok) {
    let message = "Falha ao criar item";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDTO;
}