import React, { createContext, useContext, useState } from 'react'
import api from '../api.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'buildkart_token'
const USER_KEY = 'buildkart_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [error, setError] = useState(null)

  function persist(token, user) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
  }

  async function login({ mobileNumber, password, userType }) {
    setError(null)
    try {
      const res = await api.post('/auth/login', { mobileNumber, password, userType })
      persist(res.data.token, res.data.user)
      return res.data.user
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw new Error(message)
    }
  }

  async function register(fields) {
    setError(null)
    try {
      const res = await api.post('/auth/register', fields)
      persist(res.data.token, res.data.user)
      return res.data.user
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw new Error(message)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = { user, isAuthenticated: !!user, login, register, logout, error, setError }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
