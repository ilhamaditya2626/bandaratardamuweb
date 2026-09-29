const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    // Forward cookies for Better Auth session-based auth
    credentials: 'include',
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `Request gagal dengan status ${response.status}`;
    try {
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Non-JSON response (misal HTML dari web server LiteSpeed/Nginx atau Next.js)
        if (response.status === 401 || response.status === 403) {
          errorMessage = "Sesi login tidak sah atau akses ditolak. Silakan login kembali.";
        } else if (response.status === 413) {
          errorMessage = "Ukuran file terlalu besar untuk server.";
        } else if (response.status === 500) {
          errorMessage = "Terjadi kesalahan internal server (500). Silakan periksa log server.";
        } else if (response.status === 502 || response.status === 504) {
          errorMessage = "Server sedang tidak dapat dihubungi (Gateway/Timeout).";
        } else if (text && text.length > 0 && text.length < 200 && !text.includes("<html")) {
          errorMessage = text.trim();
        } else {
          errorMessage = response.statusText || errorMessage;
        }
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    const err = new Error(errorMessage) as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const ApiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    });
  },

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    });
  },

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    });
  },

  /**
   * DELETE with an optional JSON body.
   * Needed to send { id } for admin delete endpoints
   * (some servers reject body-less DELETEs with no target info).
   */
  delete: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      ...(body !== undefined && { body: JSON.stringify(body) }),
    }),
};
