import type { Incident, Severity, Status } from '../types';

const BASE_URL = '';

interface ApiErrorBody {
  message?: string;
  issues?: { message: string }[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // non-JSON error body
    }
    const detail = body.issues?.map((issue) => issue.message).join('; ');
    const error = new Error(
      detail ? `${body.message ?? 'Request failed'}: ${detail}` : (body.message ?? 'Request failed'),
    ) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    request<{ token: string; user: { id: number; email: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  fetchIncidents: () => request<Incident[]>('/api/incidents'),

  createIncident: (data: { title: string; description?: string; severity: Severity }) =>
    request<Incident>('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateIncident: (id: number, data: { status?: Status; severity?: Severity }) =>
    request<Incident>(`/api/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteIncident: (id: number) => request<void>(`/api/incidents/${id}`, { method: 'DELETE' }),
};