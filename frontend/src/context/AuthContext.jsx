import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au démarrage
    // en appelant /auth/me — le cookie est envoyé automatiquement
    api.get('/auth/me')
      .then(res => {
        setUser(res.data)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (userData) => {    
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')  // efface le cookie côté serveur
    } catch (err) {
      console.error('Erreur logout:', err)
    }
    setUser(null)
  }

  const isAuthenticated = !!user

  const hasRole = (roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ 
      user, loading,
      login, logout, 
      isAuthenticated, hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)