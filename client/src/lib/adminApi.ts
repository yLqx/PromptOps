/**
 * Admin API utilities - separate from regular Supabase auth
 */

export async function adminApiRequest(
  method: string,
  url: string,
  body?: any
): Promise<Response> {
  const response = await fetch(url, {
    method,
    credentials: 'include', // Include cookies for admin auth
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}

export async function adminApiRequestJson(
  method: string,
  url: string,
  body?: any
): Promise<any> {
  const response = await adminApiRequest(method, url, body);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Admin query function for React Query
export const adminQueryFn = async (url: string) => {
  const response = await adminApiRequest("GET", url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};
