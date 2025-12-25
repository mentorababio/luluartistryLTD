import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Proxy request to backend API
 * This is used as a fallback when CORS is not properly configured
 */
export async function proxyRequest(
  request: NextRequest,
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
) {
  try {
    const method = options.method || request.method;

    // Preserve query parameters from original request
    const url = new URL(request.url);
    const queryString = url.search;
    const fullEndpoint = `${endpoint}${queryString}`;
    const backendUrl = `${BACKEND_URL}${fullEndpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Forward authorization header if present
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (options.body || ["POST", "PUT", "PATCH"].includes(method)) {
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      } else {
        try {
          const requestBody = await request.json();
          fetchOptions.body = JSON.stringify(requestBody);
        } catch {
          // If request body parsing fails, continue without body
        }
      }
    }

    const response = await fetch(backendUrl, fetchOptions);
    const data = await response.json();

    // Return the backend's response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to backend",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
