// Using emoji for claps instead of an icon
import { useState, useMemo, useEffect, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getNews } from '../utils/api'
import { getComments, createComment as apiCreateComment, updateComment as apiUpdateComment, deleteComment as apiDeleteComment } from '../utils/api'
import { AuthContext } from '../context/AuthContext'

export default function Home() {
  const [likedArticles, setLikedArticles] = useState({})
  const [newsArticles, setNewsArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Track clap counts per-article locally so UI updates immediately when users clap
  const [clapsMap, setClapsMap] = useState({})
  const { user } = useContext(AuthContext)

  // comments per news id
  const [commentsMap, setCommentsMap] = useState({})
  const [commentDrafts, setCommentDrafts] = useState({})
  const [editingCommentId, setEditingCommentId] = useState(null)

  // Server-driven feed: fetch from API whenever filters/search/pagination change
  const pageSize = 5
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Sidebar data
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [trendingArticles, setTrendingArticles] = useState([])

  // Search & filter state (move before data-loading effect so they're initialized)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialFilters = searchParams.get('filters') ? searchParams.get('filters').split(',').filter(Boolean) : []
  const [activeFilters, setActiveFilters] = useState(initialFilters)
  const initialSort = searchParams.get('sort') || 'newest'
  const [sortOrder, setSortOrder] = useState(initialSort)
  const initialMinClaps = (() => {
    const v = parseInt(searchParams.get('minClaps') || '0', 10)
    return Number.isFinite(v) && v > 0 ? v : 0
  })()
  const [minClaps, setMinClaps] = useState(initialMinClaps)
  const initialClapSort = searchParams.get('clapSort') || ''
  const [clapSort, setClapSort] = useState(initialClapSort)
  const initialAuthor = searchParams.get('author') || ''
  const [authorFilter, setAuthorFilter] = useState(initialAuthor)
  // Track current page locally; server returns `totalPages`/`totalItems`
  const [page, setPage] = useState(1)
  

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const params = {
          page,
          limit: pageSize,
          q: debouncedQuery || undefined,
          filters: activeFilters && activeFilters.length ? activeFilters.join(',') : undefined,
          author: authorFilter || undefined,
          minClaps: minClaps && minClaps > 0 ? String(minClaps) : undefined,
          clapSort: clapSort || undefined,
          sort: sortOrder || undefined
        }

        const [feedRes, featuredRes, trendingRes] = await Promise.all([
          getNews(params),
          // fetch featured list for sidebar/featured article
          getNews({ filters: 'featured', limit: 7 }),
          // top 3 by claps for Trending
          getNews({ clapSort: 'max', limit: 3 })
        ])

        if (!mounted) return
        setNewsArticles(feedRes.news || [])
        setTotalItems(feedRes.total || (feedRes.news || []).length)
        setTotalPages(feedRes.totalPages || 1)
        setFeaturedArticles((featuredRes && featuredRes.news) || [])
        setTrendingArticles((trendingRes && trendingRes.news) || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news articles')
        setNewsArticles([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, activeFilters, authorFilter, minClaps, clapSort, sortOrder, page])

  // Initialize clapsMap from fetched articles and load comments
  useEffect(() => {
    if (!newsArticles || newsArticles.length === 0) return
    const map = {}
    newsArticles.forEach(a => {
      map[a.id] = Number.isFinite(a.claps) ? a.claps : 0
    })
    setClapsMap(map)

    // fetch comments for all articles (small scale). Store under commentsMap[newsId]
    const loadAllComments = async () => {
      try {
        const entries = await Promise.all(
          newsArticles.map(async (a) => {
            try {
              const res = await getComments(a.id)
              return [a.id, res.comments || []]
            } catch (e) {
              return [a.id, []]
            }
          })
        )
        const cm = Object.fromEntries(entries)
        setCommentsMap(cm)
      } catch (err) {
        // ignore
      }
    }
    loadAllComments()
  }, [newsArticles])

  const toggleLike = (id) => {
    // Always increment clap count by 1 for this article on each click
    setClapsMap(prevMap => ({
      ...prevMap,
      [id]: (prevMap[id] || 0) + 1
    }))
  }

  // Comments handlers
  const handleCreateComment = async (newsId) => {
    const text = (commentDrafts[newsId] || '').trim()
    if (!text) return
    try {
      const c = await apiCreateComment(newsId, { content: text })
      setCommentsMap((prev) => ({
        ...prev,
        [newsId]: [c, ...(prev[newsId] || [])]
      }))
      setCommentDrafts((prev) => ({ ...prev, [newsId]: '' }))
    } catch (err) {
      console.error('Failed to create comment', err)
    }
  }

  const handleUpdateComment = async (commentId, newsId) => {
    const text = (commentDrafts[commentId] || '').trim()
    if (!text) return
    try {
      const updated = await apiUpdateComment(commentId, { content: text })
      setCommentsMap((prev) => ({
        ...prev,
        [newsId]: (prev[newsId] || []).map((c) => (c.id === updated.id ? updated : c))
      }))
      setEditingCommentId(null)
      setCommentDrafts((prev) => ({ ...prev, [commentId]: '' }))
    } catch (err) {
      console.error('Failed to update comment', err)
    }
  }

  const handleDeleteComment = async (commentId, newsId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await apiDeleteComment(commentId)
      setCommentsMap((prev) => ({
        ...prev,
        [newsId]: (prev[newsId] || []).filter((c) => c.id !== commentId)
      }))
    } catch (err) {
      console.error('Failed to delete comment', err)
    }
  }

  

    useEffect(() => {
      const t = setTimeout(() => {
        setDebouncedQuery(searchQuery.trim())
      }, 250)
      return () => clearTimeout(t)
    }, [searchQuery])

    const handleSearch = (e) => {
      if (e && e.preventDefault) e.preventDefault()
      setDebouncedQuery(searchQuery.trim())
    }

    const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    // Highlighting/search tokenization removed from frontend — server performs
    // all searching/filtering. Keep a no-op highlight helper to avoid JSX changes.
    const highlight = (text = '') => text

  // derive list of unique authors from the current feed (server-driven)
  const uniqueAuthors = useMemo(() => Array.from(new Set(newsArticles.map(a => a.author))).sort(), [newsArticles])

  // Keep Featured constant (first from server-fetched featured list)
  const featuredArticle = (featuredArticles && featuredArticles[0]) || null

  // Pagination state: page is tracked locally, server returns paginated results

  // Reset to first page when the search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedQuery])

  // Initialize page from URL, and persist filters/author/page to URL whenever they change.
  const initialPage = (() => {
    const p = parseInt(searchParams.get('page') || '1', 10)
    return Number.isFinite(p) && p > 0 ? p : 1
  })()

  // Ensure page state initializes from URL on first render
  useEffect(() => {
    setPage(initialPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const params = {}
    if (activeFilters && activeFilters.length) params.filters = activeFilters.join(',')
    if (authorFilter) params.author = authorFilter
    if (page && page > 1) params.page = String(page)
    if (sortOrder && sortOrder !== 'newest') params.sort = sortOrder
    if (minClaps && minClaps > 0) params.minClaps = String(minClaps)
    if (clapSort && clapSort !== '') params.clapSort = clapSort
    setSearchParams(params)
    // we intentionally include setSearchParams in deps through react-hooks linting
  }, [activeFilters, authorFilter, page, sortOrder, minClaps, clapSort, setSearchParams])

  // Use server-provided pagination: `newsArticles` already contains the
  // current page's items, `totalItems` and `totalPages` are managed by state.
  // Ensure current page is valid if the filtered set (server-side) shrinks.
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  const paginatedArticles = newsArticles || []

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading news articles...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Featured Article */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Featured</span>
              </div>
              {featuredArticle ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {featuredArticle.description}
                  </p>
                  <div>
                    <p className="text-sm text-gray-700">By <span className="font-semibold text-gray-900">{featuredArticle.author}</span></p>
                    <p className="text-sm text-gray-600">{featuredArticle.date} • {featuredArticle.readTime}</p>
                  </div>
                </>
              ) : (
                <div className="text-gray-600">No featured article</div>
              )}
            </div>
            <div className="md:col-span-1">
              <div className="relative h-80 overflow-hidden rounded-lg bg-gray-200">
                {featuredArticle && (
                  <img
                    src={featuredArticle.image || '/images/tech-news.svg'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, authors, or categories"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-black text-white rounded-r-lg font-medium hover:bg-gray-800"
                >
                  Search
                </button>
            </form>
              {/* Filter buttons: All / Trending / Featured (multi-select) */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => { setActiveFilters([]); setPage(1) }}
                  className={`px-3 py-1 rounded ${activeFilters.length === 0 ? 'bg-black text-white' : 'bg-white border'}`}>
                  All
                </button>
                {['trending', 'featured'].map((f) => {
                  const active = activeFilters.includes(f)
                  return (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilters((prev) => {
                          const next = prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                          return next
                        })
                        setPage(1)
                      }}
                      className={`px-3 py-1 rounded ${active ? 'bg-black text-white' : 'bg-white border'}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  )
                })}
                {/* Author filter select */}
                <select
                  value={authorFilter}
                  onChange={(e) => { setAuthorFilter(e.target.value); setPage(1) }}
                  className="ml-3 px-3 py-1 border rounded bg-white text-sm"
                >
                  <option value="">All authors</option>
                  {uniqueAuthors.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {/* Sort by date select */}
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1) }}
                  className="ml-3 px-3 py-1 border rounded bg-white text-sm"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <span className="ml-2 text-sm text-gray-600" title={sortOrder === 'newest' ? 'Sorted by newest first' : 'Sorted by oldest first'}>
                  {sortOrder === 'newest' ? '▲' : '▼'}
                </span>
                {/* Clap sort buttons */}
                <button
                  onClick={() => { setClapSort('min'); setPage(1) }}
                  className={`ml-2 px-3 py-1 rounded ${clapSort === 'min' ? 'bg-black text-white' : 'bg-white border'}`}>
                  Least claps
                </button>
                <button
                  onClick={() => { setClapSort('max'); setPage(1) }}
                  className={`ml-2 px-3 py-1 rounded ${clapSort === 'max' ? 'bg-black text-white' : 'bg-white border'}`}>
                  Most claps
                </button>
              </div>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Feed */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
                {paginatedArticles.map((article) => (
                <article
                  key={article.id}
                  className="border-b border-gray-200 pb-8 group cursor-pointer"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Article Content */}
                    <div className="sm:col-span-3">
                      <div className="mb-3">
                        <span className="text-sm text-gray-700 font-medium">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-3">
                          {highlight(article.title)}
                          {/* Badges for tags */}
                          <span className="ml-2 inline-flex items-center gap-2">
                            {Array.isArray(article.tags) && article.tags.includes('featured') && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Featured</span>
                            )}
                            {Array.isArray(article.tags) && article.tags.includes('trending') && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Trending</span>
                            )}
                          </span>
                      </h3>
                      <p className="text-gray-600 text-base mb-4 line-clamp-2">
                        {highlight(article.description)}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700">By <span className="text-sm font-medium text-gray-900">{article.author}</span></p>
                          <p className="text-xs text-gray-600">{article.date} • {article.readTime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLike(article.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                            aria-label="Clap for article"
                          >
                            <span className={`${likedArticles[article.id] ? 'text-yellow-500' : 'text-gray-600'} text-lg`}>👏</span>
                            <span className="text-sm text-gray-700">{clapsMap[article.id] ?? article.claps ?? 0}</span>
                          </button>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="mt-4">
                        <div className="space-y-3">
                          {(commentsMap[article.id] || []).map((c) => (
                            <div key={c.id} className="text-sm bg-gray-50 p-3 rounded-md">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-xs text-gray-700 mb-1"><span className="font-medium">{c.author?.name || c.author?.email}</span> <span className="text-gray-400">· {new Date(c.createdAt).toLocaleString()}</span></p>
                                  {editingCommentId === c.id ? (
                                    <>
                                      <textarea
                                        value={commentDrafts[c.id] ?? c.content}
                                        onChange={(e) => setCommentDrafts(prev => ({ ...prev, [c.id]: e.target.value }))}
                                        className="w-full border p-2 rounded mb-2"
                                      />
                                      <div className="flex gap-2">
                                        <button onClick={() => handleUpdateComment(c.id, article.id)} className="px-3 py-1 bg-black text-white rounded">Save</button>
                                        <button onClick={() => { setEditingCommentId(null); setCommentDrafts(prev => ({ ...prev, [c.id]: '' })) }} className="px-3 py-1 border rounded">Cancel</button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-gray-800 whitespace-pre-wrap">{c.content}</p>
                                      {user && (user.id === c.author?.id || user.role === 'admin') && (
                                        <div className="mt-2 flex gap-3">
                                          <button onClick={() => { setEditingCommentId(c.id); setCommentDrafts(prev => ({ ...prev, [c.id]: c.content })) }} className="text-sm text-blue-600">Edit</button>
                                          <button onClick={() => handleDeleteComment(c.id, article.id)} className="text-sm text-red-600">Delete</button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {user ? (
                          <div className="mt-3">
                            <textarea
                              value={commentDrafts[article.id] ?? ''}
                              onChange={(e) => setCommentDrafts(prev => ({ ...prev, [article.id]: e.target.value }))}
                              placeholder="Write a comment..."
                              className="w-full border p-2 rounded"
                            />
                            <div className="mt-2 flex justify-end">
                              <button onClick={() => handleCreateComment(article.id)} className="px-3 py-1 bg-black text-white rounded">Comment</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 text-sm text-gray-500">Sign in to leave a comment.</div>
                        )}
                      </div>
                    </div>

                    {/* Article Image */}
                    <div className="sm:col-span-1">
                      <div className="relative h-32 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 transition-opacity">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {totalItems === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalItems)}
                {' '}—{' '}
                {Math.min(page * pageSize, totalItems)} of {totalItems} articles
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white border'}`}>
                  Prev
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-black text-white' : 'bg-white border text-gray-700'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-white border'}`}>
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Section */}
            <div className="sticky top-20">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trending</h3>
                <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {trendingArticles.map((article, index) => (
                    <a
                      key={article.id}
                      className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                      href="#"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{article.title}</h4>
                        <div className="mt-1 text-xs text-gray-500">By {article.author} • {article.date} • {article.readTime}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLike(article.id)}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                          aria-label={`Clap for ${article.title}`}
                        >
                          <span className="text-sm text-gray-700">👏</span>
                          <span className="text-xs text-gray-500">{clapsMap[article.id] ?? article.claps ?? 0}</span>
                        </button>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



