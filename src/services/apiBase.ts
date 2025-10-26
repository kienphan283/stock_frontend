// Base API configuration and utilities
import type { ApiResponse } from "@/types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const PYTHON_API_URL =
  process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

export { BACKEND_URL, PYTHON_API_URL };

/**
 * Generic API request function
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  console.log("API Response:", { url, data });

  // Handle different response formats
  if (data.success === false) {
    console.error("API returned success=false:", data);
    throw new Error(data.error || "API request failed");
  }

  // If response has success and data properties, extract data
  if (data.success && data.data) {
    return data.data;
  }

  // If response doesn't have success property, assume it's the data itself
  if (data.success === undefined) {
    console.log("Response without success wrapper, returning as-is");
    return data as unknown as T;
  }

  // If data.success is true but data.data is missing
  console.error("Invalid API response structure:", data);
  throw new Error("Invalid API response structure");
}
