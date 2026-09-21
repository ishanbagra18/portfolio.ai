import { getToken } from './auth'

const rawApiUrl = import.meta.env.VITE_API_URL;

export const getApiBaseUrl = () => {
  if (rawApiUrl) return rawApiUrl.replace(/\/$/, '');
  if (import.meta.env.MODE === 'production') return 'https://portfolio-ai-gzyo.onrender.com';
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://127.0.0.1:5000';
};

export const API_BASE = getApiBaseUrl();

export async function fetchWithFallback(urlPath, options = {}) {
  const primaryBase = API_BASE;
  const targetPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  
  try {
    return await fetch(`${primaryBase}${targetPath}`, options);
  } catch (err) {
    // Retry with alternate local hostname if localhost vs 127.0.0.1 mismatch occurred
    let altBase = null;
    if (primaryBase.includes('127.0.0.1')) {
      altBase = primaryBase.replace('127.0.0.1', 'localhost');
    } else if (primaryBase.includes('localhost')) {
      altBase = primaryBase.replace('localhost', '127.0.0.1');
    }
    
    if (altBase) {
      try {
        return await fetch(`${altBase}${targetPath}`, options);
      } catch (retryErr) {
        // Both failed
      }
    }
    throw err;
  }
}

async function request(path, options = {}, retries = 2) {
  const token = getToken()

  let response
  try {
    response = await fetchWithFallback(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch (err) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, 1000))
      return request(path, options, retries - 1)
    }
    throw new Error(`Unable to connect to backend server at ${API_BASE}. Please ensure your backend server is running on port 5000. (${err.message})`)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data
}

export function signup(payload) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyOTP(payload) {
  return request('/api/auth/login/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function forgotPassword(payload) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resetPassword(payload) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function oauthSession(payload) {
  return request('/api/auth/oauth/session', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}



export function getProfile() {
  return request('/api/auth/profile')
}

export function updateProfile(payload) {
  return request('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return request('/api/auth/logout', {
    method: 'POST',
  })
}

export function getPublicPortfolio(userId) {
  return request(`/api/auth/portfolio/${userId}`)
}

export function fetchPublicPortfolioBySlug(slug) {
  return request(`/api/portfolio/public/${slug}`)
}

export function togglePortfolioPublic(portfolioId) {
  return request(`/api/portfolio/${portfolioId}/toggle-public`, {
    method: 'POST',
  })
}

