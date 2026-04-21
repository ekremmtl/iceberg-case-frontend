import type {
  Agent,
  Transaction,
  DashboardSummary,
  CreateTransactionPayload,
  CreateAgentPayload,
  AddPaymentPayload,
  AuthUser,
} from "~/types";

function getToken(): string | null {
  if (import.meta.server) return null;
  return localStorage.getItem("iceberg_auth_token");
}

export let apiBaseUrl = "http://localhost:3000";

export function setApiBaseUrl(url: string) {
  apiBaseUrl = url;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = apiBaseUrl;

  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (import.meta.client && window.location.pathname !== "/login") {
      localStorage.removeItem("iceberg_auth_token");
      window.location.href = "/login";
    }
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<AuthUser>("/auth/me"),
  },

  agents: {
    list: () => request<Agent[]>("/agents"),
    get: (id: string) => request<Agent>(`/agents/${id}`),
    create: (payload: CreateAgentPayload) =>
      request<Agent>("/agents", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    update: (id: string, payload: Partial<CreateAgentPayload>) =>
      request<Agent>(`/agents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<void>(`/agents/${id}`, { method: "DELETE" }),
  },

  transactions: {
    list: () => request<Transaction[]>("/transactions"),
    get: (id: string) => request<Transaction>(`/transactions/${id}`),
    create: (payload: CreateTransactionPayload) =>
      request<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateStage: (id: string, stage: string) =>
      request<Transaction>(`/transactions/${id}/stage`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      }),
    update: (id: string, payload: Partial<CreateTransactionPayload>) =>
      request<Transaction>(`/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<void>(`/transactions/${id}`, { method: "DELETE" }),
    addPayment: (id: string, payload: AddPaymentPayload) =>
      request<Transaction>(`/transactions/${id}/payments`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updatePayment: (id: string, paymentId: string, payload: Partial<AddPaymentPayload>) =>
      request<Transaction>(`/transactions/${id}/payments/${paymentId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    removePayment: (id: string, paymentId: string) =>
      request<Transaction>(`/transactions/${id}/payments/${paymentId}`, {
        method: "DELETE",
      }),
    financialBreakdown: (id: string) =>
      request<Transaction["financialBreakdown"]>(
        `/transactions/${id}/financial-breakdown`,
      ),
  },

  dashboard: {
    summary: () => request<DashboardSummary>("/dashboard/summary"),
  },
};
