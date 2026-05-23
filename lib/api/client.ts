const BASE_URL = "https://luluartistry-backend.onrender.com/api";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const apiClient = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  patch: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },
};

// ─── Correct endpoint paths matching Render backend ───────────────────────────

export const endpoints = {
  // Auth
  login:          "/auth/login",
  register:       "/auth/register",
  me:             "/auth/me",
  updateProfile:  "/auth/update-profile",
  updatePassword: "/auth/update-password",
  logout:         "/auth/logout",

  // Orders — user
  createOrder:    "/orders",
  myOrders:       "/orders/my",
  myOrder: (id: string) => `/orders/my/${id}`,
  cancelOrder: (id: string) => `/orders/${id}/cancel`,

  // Payment
  initializePayment: "/payment/initialize",
  verifyPayment: (ref: string) => `/payment/verify/${ref}`,
};