import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/env'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        if (mounted) {
          setAuthorized(false)
          setLoading(false)
        }
        return
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!mounted) return
        if (res.ok) setAuthorized(true)
        else {
          localStorage.removeItem('token')
          setAuthorized(false)
        }
      } catch (err) {
        console.warn('Auth check failed', err)
        localStorage.removeItem('token')
        setAuthorized(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-8">Checking authentication...</div>
  if (!authorized) return <Navigate to="/login" replace />
  return children
}
