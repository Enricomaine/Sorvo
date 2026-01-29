export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const TOKEN_KEY = "sorvo_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login: payload }),
  });

  if (!res.ok) {
    let message = "Erro ao autenticar";
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }

  const data = (await res.json()) as LoginResponse;
  return data;
}

export async function logout(): Promise<void> {
  await fetch("/api/v1/logout", { method: "DELETE" });
  clearToken();
}
