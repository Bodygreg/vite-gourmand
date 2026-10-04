import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true  // ← envoie automatiquement les cookies
})

// Intercepteur — gère les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ne pas rediriger si c'est /auth/me (vérification au démarrage)
      const url = error.config?.url || ''
      if (!url.includes('/auth/me')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api