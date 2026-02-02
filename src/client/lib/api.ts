// API client with Clerk authentication

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get token from Clerk - this will be available after ClerkProvider mounts
  const token = await window.Clerk?.session?.getToken();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Project API
export const projectsApi = {
  list: () => fetchWithAuth('/api/projects'),

  get: (id: string) => fetchWithAuth(`/api/projects/${id}`),

  create: (data: { title?: string; sourceType?: string; sourceUrl?: string }) =>
    fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  process: (id: string) =>
    fetchWithAuth(`/api/projects/${id}/process`, {
      method: 'POST',
    }),
};

// Extend Window interface for Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}
