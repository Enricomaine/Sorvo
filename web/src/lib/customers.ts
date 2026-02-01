import { getToken } from "./auth";

export interface CustomerDTO {
  id: number;
  name: string;
  document: string | null;
  phone: string | null;
  active: boolean;
  person_type: "person" | "business";
  user?: { email: string } | null;
  price_table?: { description: string } | null;
}

export async function fetchCustomers(): Promise<CustomerDTO[]> {
  const token = getToken();
  const res = await fetch("/api/v1/customers", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar clientes";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  const data = (await res.json()) as CustomerDTO[];
  return data;
}

export async function fetchCustomer(id: string | number): Promise<CustomerDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/customers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = "Falha ao carregar cliente";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as CustomerDTO;
}

export interface UpdateCustomerPayload {
  name: string;
  document: string | null;
  phone: string | null;
  person_type: "person" | "business";
  active: boolean;
  user_attributes?: { email: string; password?: string };
  price_table_id?: number | null;
}

export async function updateCustomer(id: string | number, payload: UpdateCustomerPayload): Promise<CustomerDTO> {
  const token = getToken();
  const res = await fetch(`/api/v1/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ customer: payload }),
  });
  if (!res.ok) {
    let message = "Falha ao salvar cliente";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as CustomerDTO;
}
