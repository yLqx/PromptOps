import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  body?: any
): Promise<Response> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `HTTP error! status: ${response.status}`);
  }

  return response;
}

export function getQueryFn({ on401 }: { on401?: "returnNull" } = {}) {
  return async ({ queryKey, signal }: { queryKey: readonly unknown[]; signal?: AbortSignal }) => {
    const response = await fetch(queryKey[0] as string, {
      signal,
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        if (on401 === "returnNull") {
          return null;
        }
        throw new Error('Unauthorized');
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  };
}

// Query client for cache invalidation
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
    },
  },
});
