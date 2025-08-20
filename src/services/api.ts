/* Minimal API client with token support and typed helpers */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    try {
      const saved = localStorage.getItem('auth_token');
      if (saved) this.authToken = saved;
    } catch {}
  }

  setToken(token: string | null) {
    this.authToken = token;
    try {
      if (token) localStorage.setItem('auth_token', token);
      else localStorage.removeItem('auth_token');
    } catch {}
  }

  getToken(): string | null {
    return this.authToken;
  }

  async request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`API ${method} ${path} failed: ${response.status} ${text}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return (await response.json()) as T;
    // @ts-expect-error generic as any when not JSON
    return undefined as T;
  }

  get<T>(path: string) {
    return this.request<T>(path, 'GET');
  }
  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, 'POST', body);
  }
  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, 'PUT', body);
  }
  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, 'PATCH', body);
  }
  delete<T>(path: string) {
    return this.request<T>(path, 'DELETE');
  }
}

// Singleton factory using Vite env
let apiInstance: ApiClient | null = null;
export const getApi = (): ApiClient => {
  if (apiInstance) return apiInstance;
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!baseUrl) throw new Error('VITE_API_BASE_URL is not set');
  apiInstance = new ApiClient(baseUrl);
  return apiInstance;
};

// Endpoint helpers (retain for backend compatibility if used). For Clerk, you will typically
// call your backend with a Clerk JWT from the client or let the backend validate the session.
export interface LoginResponse { token: string; user: any }
export interface RegisterResponse { token: string; user: any }

export const AuthAPI = {
  async login(email: string, password: string, role?: string) {
    const api = getApi();
    const res = await api.post<LoginResponse>('/auth/login', { email, password, role });
    api.setToken(res.token);
    return res.user;
  },
  async register(name: string, email: string, password: string, role: string) {
    const api = getApi();
    const res = await api.post<RegisterResponse>('/auth/register', { name, email, password, role });
    api.setToken(res.token);
    return res.user;
  },
  async me() {
    const api = getApi();
    return api.get<any>('/auth/me');
  },
  logout() {
    const api = getApi();
    api.setToken(null);
  }
};

export const EventsAPI = {
  list() {
    const api = getApi();
    return api.get<any[]>('/events');
  },
  getById(id: number) {
    const api = getApi();
    return api.get<any>(`/events/${id}`);
  },
  create(payload: any) {
    const api = getApi();
    return api.post<any>('/events', payload);
  },
  update(id: number, payload: any) {
    const api = getApi();
    return api.put<any>(`/events/${id}`, payload);
  },
  remove(id: number) {
    const api = getApi();
    return api.delete<void>(`/events/${id}`);
  }
};

export const SubmissionsAPI = {
  listByEvent(eventId: number) {
    const api = getApi();
    return api.get<any[]>(`/events/${eventId}/submissions`);
  },
  create(payload: any) {
    const api = getApi();
    return api.post<any>('/submissions', payload);
  },
  update(id: number, payload: any) {
    const api = getApi();
    return api.put<any>(`/submissions/${id}`, payload);
  }
};


