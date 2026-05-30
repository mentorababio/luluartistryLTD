const BASE_URL = "https://luluartistry-backend.onrender.com"; 

const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
const authHeaders = () => {
  const token = getToken();

  console.log("TOKEN FROM STORAGE:", token);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log("FINAL HEADERS:", headers);

  return headers;
};
export const apiClient = {
  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`[API CALL] POST ${url}`);
    
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    const text = await res.text();

    if (!res.ok || text.trim().startsWith('<')) {
      console.error("SERVER ERROR RESPONSE:", text);
      throw new Error(`API Error ${res.status}: The server returned an invalid response.`);
    }

    return JSON.parse(text);
  },

  get: async <T = any>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const text = await res.text();
    if (!res.ok || text.trim().startsWith('<')) throw new Error(`API Error: ${res.status}`);
    return JSON.parse(text);
  },
};

export const endpoints = {
  createOrder:        "/api/orders/checkout",
  myOrders:           "/api/orders/my",
  myOrder:            (id: string) => `/api/orders/my/${id}`,
  cancelOrder:        (id: string) => `/api/orders/${id}/cancel`,
  initializePayment:  "/api/payment/initialize",
  verifyPayment:      (ref: string) => `/api/payment/verify/${ref}`,
};