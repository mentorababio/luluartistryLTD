const BASE_URL = ""

const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const apiClient = {
  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`[API CALL] POST ${url}`); // CHECK THIS IN BROWSER CONSOLE
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },
  // ... (keep your other methods: get, put, patch, delete)
};

export const endpoints = {
  // ... (auth endpoints)
  createOrder: "/orders", // Correct: No trailing slash
  myOrders: "/orders/my",
  myOrder: (id: string) => `/orders/my/${id}`,
  cancelOrder: (id: string) => `/orders/${id}/cancel`,
  // ... (rest of the endpoints)
};