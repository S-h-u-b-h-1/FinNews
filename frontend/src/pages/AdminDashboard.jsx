import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, Trash2, LogOut, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '../config/env'
import { useNavigate } from 'react-router-dom'

const initialArticle = {
  title: '',
  description: '',
  category: '',
  date: '',
  image: '',
  author: '',
  readTime: '',
  tags: '',
  claps: 0
}

export default function AdminDashboard() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState(initialArticle)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news?limit=100`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to load news')
      setNews(data.news || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData(initialArticle)
  }

  const handleCreateNews = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0],
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
        claps: Number(formData.claps) || 0
      }
      const res = await fetch(`${API_BASE_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to upload news')
      setMessage('News article published!')
      resetForm()
      fetchNews()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news article?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to delete news')
      }
      setNews((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      // logout failed (ignored)
    } finally {
      navigate('/creator', { replace: true })
    }
  }

  const totalFeatured = useMemo(() => news.filter((item) => (item.tags || []).includes('featured')).length, [news])
  const totalTrending = useMemo(() => news.filter((item) => (item.tags || []).includes('trending')).length, [news])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Finnews Creator Studio</p>
            <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-2">Total published</p>
            <h2 className="text-3xl font-bold">{news.length}</h2>
            <p className="text-sm text-gray-500">Articles live in feed</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-2">Featured</p>
            <h2 className="text-3xl font-bold">{totalFeatured}</h2>
            <p className="text-sm text-gray-500">Tagged as featured</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-2">Trending</p>
            <h2 className="text-3xl font-bold">{totalTrending}</h2>
            <p className="text-sm text-gray-500">Marked trending</p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="text-gray-900" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Upload news article</h3>
              <p className="text-sm text-gray-500">Fill in details and publish instantly</p>
            </div>
          </div>

          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreateNews}>
            <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="border border-gray-300 rounded-lg px-4 py-3" required />
            <input name="author" value={formData.author} onChange={handleInputChange} placeholder="Author" className="border border-gray-300 rounded-lg px-4 py-3" required />
            <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" className="border border-gray-300 rounded-lg px-4 py-3" required />
            <input name="readTime" value={formData.readTime} onChange={handleInputChange} placeholder="Read time e.g. 6 min read" className="border border-gray-300 rounded-lg px-4 py-3" required />
            <input name="date" value={formData.date} onChange={handleInputChange} placeholder="Date e.g. 2025-12-04" className="border border-gray-300 rounded-lg px-4 py-3" />
            <input name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" className="border border-gray-300 rounded-lg px-4 py-3" />
            <input name="claps" value={formData.claps} onChange={handleInputChange} placeholder="Initial claps" className="border border-gray-300 rounded-lg px-4 py-3" type="number" min="0" />
            <input name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (comma separated)" className="border border-gray-300 rounded-lg px-4 py-3" />
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 min-h-[120px]" required />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                Publish article
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">News library</h3>
              <p className="text-sm text-gray-500">Manage every story on Finnews</p>
            </div>
            <span className="text-sm text-gray-500">{news.length} articles</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="animate-spin mr-2" />
              Loading news...
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-500">
                      {article.category} • {article.author} • {article.date}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {(article.tags || []).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ))}
              {news.length === 0 && <div className="text-center text-gray-500 py-12">No news uploaded yet.</div>}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

