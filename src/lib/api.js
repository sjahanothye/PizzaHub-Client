let rawBase = process.env.NEXT_PUBLIC_API_URL || 'https://pizza-hub-server-blond.vercel.app/api';
rawBase = rawBase.trim().replace(/\/+$/, '');
if (!rawBase.startsWith('http://') && !rawBase.startsWith('https://')) {
  rawBase = `https://${rawBase}`;
}
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pizzahub_token');
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('pizzahub_token', token);
  } else {
    localStorage.removeItem('pizzahub_token');
  }
};

export async function fetchApi(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If direct server call failed (e.g. Failed to fetch due to ISP/DNS/CORS block), auto-fallback to internal proxy rewrite
    if (!endpoint.startsWith('http') && typeof window !== 'undefined' && !url.startsWith('/api')) {
      try {
        const proxyUrl = `/api${cleanEndpoint}`;
        const proxyRes = await fetch(proxyUrl, {
          ...options,
          headers,
        });
        const proxyData = await proxyRes.json().catch(() => ({}));
        if (!proxyRes.ok) {
          const proxyErr = new Error(proxyData.message || 'API request failed');
          proxyErr.status = proxyRes.status;
          proxyErr.data = proxyData;
          throw proxyErr;
        }
        return proxyData;
      } catch (proxyErr) {
        throw proxyErr;
      }
    }
    throw err;
  }
}
