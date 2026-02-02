import { getToken } from "./auth";

export interface ItemDTO {
  id: number;
  code: string;
  description: string;
  observation?: string | null;
  base_price?: number | null;
  active: boolean;
  main_image_url?: string | null;
  price?: number | null;
}

export interface ItemImageDTO {
  id: number;
  url: string;
}

export interface ItemDetails extends ItemDTO {
  main_image: { url: string | null };
  images: ItemImageDTO[];
  price?: number | null;
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

export async function fetchItem(id: number | string): Promise<ItemDetails> {
  const token = getToken();
  const res = await fetch(`/api/v1/items/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar item";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDetails;
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
    payload.images.forEach((file) => fd.append("item[images][]", file));
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

export interface UpdateItemPayload {
  code: string;
  description: string;
  observation?: string | null;
  base_price: number;
  active?: boolean;
  main_image?: File | ""; // if File replaces, if empty string clears main image
  images?: File[]; // additional images to attach
}

export async function updateItem(id: number | string, payload: UpdateItemPayload): Promise<ItemDetails> {
  const token = getToken();
  const fd = new FormData();
  fd.append("item[code]", payload.code);
  fd.append("item[description]", payload.description);
  if (payload.observation) fd.append("item[observation]", payload.observation);
  fd.append("item[base_price]", String(payload.base_price));
  if (payload.active !== undefined) fd.append("item[active]", String(payload.active));
  if (payload.main_image !== undefined) {
    if (payload.main_image === "") {
      fd.append("item[main_image]", "");
    } else {
      fd.append("item[main_image]", payload.main_image as File);
    }
  }
  if (payload.images && payload.images.length) {
    payload.images.forEach((file) => fd.append("item[images][]", file));
  }

  const res = await fetch(`/api/v1/items/${id}`, {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
  });
  if (!res.ok) {
    let message = "Falha ao atualizar item";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDetails;
}

export async function removeItemImage(itemId: number | string, imageId: number | string): Promise<ItemDetails> {
  const token = getToken();
  const res = await fetch(`/api/v1/items/${itemId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao remover imagem";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDetails;
}

export async function setItemMainImage(itemId: number | string, imageId: number | string): Promise<ItemDetails> {
  const token = getToken();
  const res = await fetch(`/api/v1/items/${itemId}/main_image/${imageId}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao definir imagem principal";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ItemDetails;
}