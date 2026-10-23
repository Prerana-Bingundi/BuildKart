import axios from 'axios'

// In dev, Vite proxies "/api" to http://localhost:5000 (see vite.config.js),
// so you don't need the full backend URL here. In production, set
// VITE_API_URL in a .env file to your deployed backend's URL.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

// Attach the logged-in user's token (if any) to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buildkart_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
