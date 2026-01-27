export type Seller = {
  id: number;
  uuid?: string;
  name: string;
  document?: string;
  phone?: string;
  active?: boolean;
  person_type?: "person" | "business";
  user?: { username?: string };
};

export async function fetchSellers(options?: { token?: string }): Promise<Seller[]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  } else {
    const stored = localStorage.getItem("authToken");
    if (stored) headers["Authorization"] = `Bearer ${stored}`;
  }

  const res = await fetch("/api/v1/sellers", {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load sellers: ${res.status} ${text}`);
  }

  return res.json();
}
