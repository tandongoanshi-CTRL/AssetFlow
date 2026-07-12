const API_BASE_URL: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export const apiClient = {
  get: async <T>(path: string, token?: string | null): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return handleResponse<T>(res);
  },

  post: async <T>(path: string, body: unknown, token?: string | null): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    return handleResponse<T>(res);
  },

  patch: async <T>(path: string, body: unknown, token?: string | null): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    return handleResponse<T>(res);
  },

  auth: {
    login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
    signup: (name: string, email: string, password: string) => apiClient.post('/auth/signup', { name, email, password }),
    me: (token: string) => apiClient.get('/auth/me', token)
  },

  admin: {
    promoteUser: (id: string, role: 'DEPT_HEAD' | 'ASSET_MANAGER', token: string) =>
      apiClient.patch(`/admin/users/${id}/role`, { role }, token)
  },

  allocations: {
    list: (token: string) => apiClient.get('/allocations', token),
    create: (payload: Record<string, unknown>, token: string) => apiClient.post('/allocations', payload, token)
  },

  transfers: {
    create: (payload: Record<string, unknown>, token: string) => apiClient.post('/transfers', payload, token),
    approve: (id: string, token: string) => apiClient.patch(`/transfers/${id}/approve`, {}, token)
  },

  bookings: {
    list: (token: string) => apiClient.get('/bookings', token),
    create: (payload: Record<string, unknown>, token: string) => apiClient.post('/bookings', payload, token)
  },

  maintenance: {
    create: (payload: Record<string, unknown>, token: string) => apiClient.post('/maintenance', payload, token),
    updateStatus: (id: string, status: string, token: string) => apiClient.patch(`/maintenance/${id}/status`, { status }, token)
  },

  audits: {
    close: (auditCycleId: string, token: string) => apiClient.post('/audits/close', { auditCycleId }, token)
  }
};

