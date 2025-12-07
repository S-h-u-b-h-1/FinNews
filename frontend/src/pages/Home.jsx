// Using emoji for claps instead of an icon
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getNews } from '../utils/api'

export default function Home() {
  const [likedArticles, setLikedArticles] = useState({})
  const [newsArticles, setNewsArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Track clap counts per-article locally so UI updates immediately when users clap
  const [clapsMap, setClapsMap] = useState({})

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await getNews({ limit: 100 }) // Get all news articles
        const sanitize = (a) => ({
          ...a,
          // ensure tags is an array of lowercase trimmed strings
          tags: Array.isArray(a.tags) ? a.tags.map(t => String(t || '').trim().toLowerCase()) : [],
          // ensure claps is a number
          claps: typeof a.claps === 'number' ? a.claps : Number(a.claps) || 0,
          // ensure author is a trimmed string
          author: String(a.author || '').trim()
        })
        setNewsArticles((response.news || []).map(sanitize))
        setError(null)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news articles')
        setNewsArticles([]) // Fallback to empty array
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Initialize clapsMap from fetched articles
  useEffect(() => {
    if (!newsArticles || newsArticles.length === 0) return
    const map = {}
    newsArticles.forEach(a => {
      map[a.id] = Number.isFinite(a.claps) ? a.claps : 0
    })
    setClapsMap(map)
  }, [newsArticles])

  const toggleLike = (id) => {
    // Always increment clap count by 1 for this article on each click
    setClapsMap(prevMap => ({
      ...prevMap,
      [id]: (prevMap[id] || 0) + 1
    }))
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialFilters = searchParams.get('filters') ? searchParams.get('filters').split(',').filter(Boolean) : []
  const [activeFilters, setActiveFilters] = useState(initialFilters) 
  const initialSort = searchParams.get('sort') || 'newest'
  const [sortOrder, setSortOrder] = useState(initialSort) // 'newest' | 'oldest'
  const initialMinClaps = (() => {
    const v = parseInt(searchParams.get('minClaps') || '0', 10)
    return Number.isFinite(v) && v > 0 ? v : 0
  })()
  const [minClaps, setMinClaps] = useState(initialMinClaps)
  const initialClapSort = searchParams.get('clapSort') || ''
  const [clapSort, setClapSort] = useState(initialClapSort)

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
    const highlight = (text = '', tokens = []) => {
      if (!tokens || tokens.length === 0) return text
      const pattern = tokens.map(escapeRegex).join('|')
      const re = new RegExp(`(${pattern})`, 'ig')
      const parts = String(text).split(re)
      return parts.map((part, i) =>
        re.test(part) ? (
          <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )
    }

  const normalize = (s = '') =>
    String(s)
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')

  const tokenize = (q = '') =>
    normalize(q)
      .split(/\s+/)
      .filter(Boolean)

  const tokens = useMemo(() => tokenize(debouncedQuery), [debouncedQuery])

  const filteredAll = useMemo(() => {
    if (!tokens.length) return newsArticles

    return newsArticles.filter((a) => {
      const title = normalize(a.title)
      const desc = normalize(a.description)
      const author = normalize(a.author)
      const category = normalize(a.category)
      const readTime = String(a.readTime || '')
      const claps = String(a.claps || '')

      return tokens.every((t) => {
        // numeric token: match claps or number in readTime
        if (/^\d+$/.test(t)) {
          if (claps.includes(t)) return true
          if (readTime.includes(t)) return true
        }
        // Otherwise check textual fields
        return (
          title.includes(t) ||
          desc.includes(t) ||
          author.includes(t) ||
          category.includes(t)
        )
      })
    })
  }, [newsArticles, tokens])


  const featuredArticles = useMemo(() => newsArticles.filter(a => Array.isArray(a.tags) && a.tags.includes('featured')).slice(0, 7), [newsArticles])

  // IDs for quick lookups (driven by tags now)
  const trendingIds = useMemo(() => newsArticles.filter(a => Array.isArray(a.tags) && a.tags.includes('trending')).map(a => a.id), [newsArticles])
  const featuredIds = useMemo(() => featuredArticles.map(a => a.id), [featuredArticles])

  // Compute trending articles by clap count (descending). Use clapsMap (live) or article.claps as fallback.
  const trendingArticles = useMemo(() => {
    if (!newsArticles || newsArticles.length === 0) return []
    return newsArticles
      .slice()
      .sort((a, b) => {
        const ca = (clapsMap[a.id] ?? a.claps ?? 0)
        const cb = (clapsMap[b.id] ?? b.claps ?? 0)
        return cb - ca
      })
      .slice(0, 3)
  }, [newsArticles, clapsMap])

  // Author filter list
  const uniqueAuthors = useMemo(() => Array.from(new Set(newsArticles.map(a => a.author))).sort(), [newsArticles])
  const initialAuthor = searchParams.get('author') || ''
  const [authorFilter, setAuthorFilter] = useState(initialAuthor)

  // Keep Featured constant (always the first featured article) and only
  // change the main feed when a search or explicit filter is active.
  const featuredArticle = featuredArticles[0]

  // Decide which list should drive the main feed. Behavior:
  // - If an explicit filter is active (trending/featured) show that set (and
  //   still apply text search tokens if present).
  // - Otherwise, if the user typed a search (tokens), show matching results
  //   across all articles.
  // - Otherwise show the default feed (articles after the featured one).
  let baseFeed = []
  if (activeFilters && activeFilters.length > 0) {
    // show articles that have any of the selected tags
    baseFeed = filteredAll.filter(a => Array.isArray(a.tags) && a.tags.some(t => activeFilters.includes(t)))
  } else if (tokens.length) {
    baseFeed = filteredAll
  } else {
    baseFeed = newsArticles.slice(1)
  }

  // Apply author filter if set
  if (authorFilter) {
    const af = String(authorFilter).trim().toLowerCase()
    if (af.length) {
      baseFeed = baseFeed.filter(a => String(a.author || '').toLowerCase().includes(af))
    }
  }

  // Apply minimum clap filter if set
  if (minClaps && minClaps > 0) {
    baseFeed = baseFeed.filter(a => (clapsMap[a.id] ?? a.claps ?? 0) >= minClaps)
  }

  // Apply sorting by date (parse article.date)
  const sortByDate = (list) => {
    // safe copy
    return list.slice().sort((a, b) => {
      const da = new Date(a.date)
      const db = new Date(b.date)
      if (Number.isNaN(da) || Number.isNaN(db)) return 0
      return sortOrder === 'oldest' ? da - db : db - da
    })
  }

  baseFeed = sortByDate(baseFeed)

  // Apply clap-based sorting when requested (use live `clapsMap` with article fallback)
  if (clapSort && clapSort !== '') {
    baseFeed = baseFeed.slice().sort((a, b) => {
      const ca = (clapsMap[a.id] ?? a.claps ?? 0)
      const cb = (clapsMap[b.id] ?? b.claps ?? 0)
      return clapSort === 'min' ? ca - cb : cb - ca
    })
  }

  // Pagination state: 5 articles per page in the main feed
  const [page, setPage] = useState(1)
  const pageSize = 5

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

  const totalItems = baseFeed.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Ensure current page is valid if the filtered set shrinks
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * pageSize
    return baseFeed.slice(start, start + pageSize)
  }, [baseFeed, page])

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
                          {highlight(article.title, tokens)}
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
                        {highlight(article.description, tokens)}
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



