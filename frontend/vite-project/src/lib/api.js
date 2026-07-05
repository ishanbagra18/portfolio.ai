import { getToken } from './auth'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = API_BASE;

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
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

