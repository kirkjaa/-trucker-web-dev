const API_BASE = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

let authToken: string | null = localStorage.getItem('authToken');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (data: any) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<any>('/auth/me'),
  },

  jobs: {
    list: (params?: { status?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any[]>(`/jobs${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/jobs/${id}`),
    create: (data: any) =>
      request<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/jobs/${id}`, { method: 'DELETE' }),
    addStop: (jobId: string, data: any) =>
      request<any>(`/jobs/${jobId}/stops`, { method: 'POST', body: JSON.stringify(data) }),
    updateStop: (jobId: string, stopId: string, data: any) =>
      request<any>(`/jobs/${jobId}/stops/${stopId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  customers: {
    list: (params?: { search?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/customers${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/customers/${id}`),
    create: (data: any) =>
      request<any>('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/customers/${id}`, { method: 'DELETE' }),
  },

  products: {
    list: (params?: { search?: string; category?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/products${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/products/${id}`),
    create: (data: any) =>
      request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/products/${id}`, { method: 'DELETE' }),
  },

  vehicles: {
    list: (params?: { status?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/vehicles${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/vehicles/${id}`),
    create: (data: any) =>
      request<any>('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/vehicles/${id}`, { method: 'DELETE' }),
  },

  expenses: {
    list: (params?: { jobId?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/expenses${query ? `?${query}` : ''}`);
    },
    summary: (params?: { startDate?: string; endDate?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any[]>(`/expenses/summary${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/expenses/${id}`),
    create: (data: any) =>
      request<any>('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/expenses/${id}`, { method: 'DELETE' }),
  },

  revenues: {
    list: (params?: { status?: string; customerId?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/revenues${query ? `?${query}` : ''}`);
    },
    summary: (params?: { year?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any>(`/revenues/summary${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/revenues/${id}`),
    create: (data: any) =>
      request<any>('/revenues', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/revenues/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/revenues/${id}`, { method: 'DELETE' }),
  },

  bids: {
    list: (params?: { status?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<{ data: any[]; total: number }>(`/bids${query ? `?${query}` : ''}`);
    },
    get: (id: string) => request<any>(`/bids/${id}`),
    create: (data: any) =>
      request<any>('/bids', { method: 'POST', body: JSON.stringify(data) }),
    submit: (id: string, price: number) =>
      request<any>(`/bids/${id}/submit`, { method: 'POST', body: JSON.stringify({ price }) }),
    update: (id: string, data: any) =>
      request<any>(`/bids/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<any>(`/bids/${id}`, { method: 'DELETE' }),
  },

  chat: {
    list: () => request<any[]>('/chat'),
    get: (id: string) => request<any>(`/chat/${id}`),
    getMessages: (id: string, params?: { limit?: number; before?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return request<any[]>(`/chat/${id}/messages${query ? `?${query}` : ''}`);
    },
    create: (data: any) =>
      request<any>('/chat', { method: 'POST', body: JSON.stringify(data) }),
    sendMessage: (id: string, data: any) =>
      request<any>(`/chat/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
    addParticipant: (id: string, userId: string) =>
      request<any>(`/chat/${id}/participants`, { method: 'POST', body: JSON.stringify({ userId }) }),
    delete: (id: string) =>
      request<any>(`/chat/${id}`, { method: 'DELETE' }),
  },

  dashboard: {
    stats: () => request<any>('/dashboard/stats'),
    recentJobs: () => request<any[]>('/dashboard/recent-jobs'),
    revenueChart: (months?: number) => {
      const query = months ? `?months=${months}` : '';
      return request<any[]>(`/dashboard/revenue-chart${query}`);
    },
  },
};

export default api;
