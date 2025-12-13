// Client-side API utility for calling backend endpoints

const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  return baseUrl ? baseUrl.replace(/\/$/, '') : '';
};

export const apiClient = {
  baseUrl: getApiBaseUrl(),

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Build full URL
  buildUrl: (endpoint: string): string => {
    const base = getApiBaseUrl();
    return base ? `${base}${endpoint}` : `/api${endpoint}`;
  },

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  },

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.message || `API Error: ${res.status}`);
    }

    return res.json();
  },

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.message || `API Error: ${res.status}`);
    }

    return res.json();
  },
};
