import { createContext, useState } from 'react'

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const login = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser || null)
    if (newToken) localStorage.setItem('token', newToken)
    if (newUser) localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
