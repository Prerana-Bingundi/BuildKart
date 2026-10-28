
import axios from 'axios'

// Production: use the deployed backend.
// Local development: use Vite's proxy to localhost:5000.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api'

const api = axios.create({ baseURL })

// Attach the logged-in user's token automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('buildkart_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
