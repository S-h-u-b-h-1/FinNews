import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail, Lock, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/env'

export default function CreatorAccess() {
  const location = useLocation()
  const qMode = new URLSearchParams(location.search).get('mode')
  const [mode, setMode] = useState(qMode === 'signup' ? 'signup' : 'login')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const checkExistingSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/me`, { credentials: 'include' })
        if (mounted && res.ok) {
          navigate('/admin/dashboard', { replace: true })
        }
      } catch (err) {
        // no existing admin session (silent in production)
      }
    }
    checkExistingSession()
    return () => {
      mounted = false
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/admin/login' : '/api/admin/signup'
      const payload =
        mode === 'login'
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Request failed')

      // Store token in localStorage so AdminRoute can use Authorization header
      if (data.token) {
        localStorage.setItem('token', data.token)
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-900 text-white p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-300 mb-4">Finnews Studio</p>
            <h1 className="text-3xl font-bold mb-4">Upload your own news</h1>
            <p className="text-gray-300">
              Become a Finnews creator, share premium stories, and manage your newsroom from a single dashboard.
            </p>
          </div>
          <div className="mt-8 space-y-3 text-gray-300 text-sm">
            <p>• Admin dashboard with detailed controls</p>
            <p>• Upload, edit, or remove news instantly</p>
            <p>• All uploads go live on the Finnews feed</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-2 mb-8">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 rounded-lg font-semibold capitalize ${
                  mode === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Full name</label>
                <div className="relative">
                  <UserCheck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Editor"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@finnews.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Enter newsroom' : 'Create admin account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

