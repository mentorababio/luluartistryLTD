// Client-side API utility for calling backend endpoints

const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return baseUrl ? baseUrl.replace(/\/$/, "") : "";
};

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const apiClient = {
  baseUrl: getApiBaseUrl(),

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  // Build full URL
  buildUrl: (endpoint: string): string => {
    const base = getApiBaseUrl();
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    return base ? `${base}${normalizedEndpoint}` : `/api${normalizedEndpoint}`;
  },

  // Handle response errors
  async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let errorData: any = {};
    if (isJson) {
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, use empty object
      }
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        apiClient.removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      const error: ApiError = {
        message:
          errorData?.message ||
          errorData?.error ||
          `API Error: ${response.status}`,
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    // Return parsed JSON or empty object
    if (isJson) {
      return await response.json();
    }
    return {} as T;
  },

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return apiClient.handleResponse<T>(res);
  },

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return apiClient.handleResponse<T>(res);
  },

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return apiClient.handleResponse<T>(res);
  },

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const url = apiClient.buildUrl(endpoint);
    const token = apiClient.getToken();

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return apiClient.handleResponse<T>(res);
  },
};
