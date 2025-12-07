import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/env'

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    let mounted = true

    const verify = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
          credentials: 'include',
          headers
        })
        if (!mounted) return
        setAuthorized(res.ok)
      } catch (error) {
        // admin check failed (ignored)
        if (mounted) setAuthorized(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    verify()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-8 text-center">Checking admin access...</div>
  if (!authorized) return <Navigate to="/creator" replace />
  return children
}

