const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function googleLogin(credential: string): Promise<AuthUser> {
  return request<AuthUser>(`${API_BASE}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout/`, { method: 'POST', credentials: 'include' });
}

export async function me(): Promise<AuthUser> {
  return request<AuthUser>(`${API_BASE}/auth/me/`);
}
