import { Heart } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'

export default function Home() {
  const [likedArticles, setLikedArticles] = useState({})

  const newsArticles = [
    {
      id: 1,
      title: 'Tech Giants Report Record Earnings',
      description: 'Major technology companies announce their strongest quarterly results, beating market expectations.',
      category: 'Technology',
      date: 'Nov 12, 2025',
      image: '/images/tech-news.svg',
      author: 'Sarah Chen',
      readTime: '5 min read',
      claps: 2340
    },
    {
      id: 2,
      title: 'Stock Market Reaches All-Time High',
      description: 'Global markets surge as investors gain confidence in economic recovery and growth prospects.',
      category: 'Markets',
      date: 'Nov 12, 2025',
      image: '/images/market-news.svg',
      author: 'James Wilson',
      readTime: '7 min read',
      claps: 1856
    },
    {
      id: 3,
      title: 'Cryptocurrency Volatility Continues',
      description: 'Digital assets experience significant price fluctuations amid regulatory developments.',
      category: 'Crypto',
      date: 'Nov 11, 2025',
      image: '/images/crypto-news.svg',
      author: 'Alex Morgan',
      readTime: '6 min read',
      claps: 3102
    },
    {
      id: 4,
      title: 'Banking Sector Shows Resilience',
      description: 'Financial institutions demonstrate strong fundamentals despite economic headwinds.',
      category: 'Finance',
      date: 'Nov 11, 2025',
      image: '/images/finance-news.svg',
      author: 'Emma Richardson',
      readTime: '8 min read',
      claps: 1543
    },
    {
      id: 5,
      title: 'Oil Prices Stabilize on Supply News',
      description: 'Energy markets stabilize following announcements about production decisions.',
      category: 'Energy',
      date: 'Nov 10, 2025',
      image: '/images/energy-news.svg',
      author: 'Michael Torres',
      readTime: '5 min read',
      claps: 892
    },
    {
      id: 6,
      title: 'Real Estate Market Booms Across Regions',
      description: 'Property values surge as demand remains strong in major metropolitan areas.',
      category: 'Real Estate',
      date: 'Nov 10, 2025',
      image: '/images/realestate-news.svg',
      author: 'Lisa Anderson',
      readTime: '6 min read',
      claps: 1220
    },
    {
      id: 7,
      title: 'Central Bank Holds Interest Rates Steady',
      description: 'Monetary policy unchanged as inflation shows signs of cooling.',
      category: 'Economy',
      date: 'Nov 09, 2025',
      image: '/images/economy-news.svg',
      author: 'Daniel Kim',
      readTime: '4 min read',
      claps: 640
    },
    {
      id: 8,
      title: 'Electric Vehicles Adoption Accelerates',
      description: 'Automakers report strong demand for new EV models driving production expansion.',
      category: 'Automotive',
      date: 'Nov 09, 2025',
      image: '/images/ev-news.svg',
      author: 'Priya Patel',
      readTime: '5 min read',
      claps: 980
    },
    {
      id: 9,
      title: 'Emerging Markets Attract Foreign Investment',
      description: 'Investors pour capital into developing economies seeking higher yields.',
      category: 'Markets',
      date: 'Nov 08, 2025',
      image: '/images/markets-news.svg',
      author: 'Omar Hernandez',
      readTime: '7 min read',
      claps: 410
    },
    {
      id: 10,
      title: 'Healthcare Innovation Spurs New Treatments',
      description: 'Biotech startups announce promising results from clinical trials.',
      category: 'Health',
      date: 'Nov 07, 2025',
      image: '/images/health-news.svg',
      author: 'Rina Sato',
      readTime: '6 min read',
      claps: 1550
    },
    {
      id: 11,
      title: 'Supply Chain Improvements Ease Inflation Pressures',
      description: 'Logistics companies report smoother operations after recent upgrades.',
      category: 'Logistics',
      date: 'Nov 06, 2025',
      image: '/images/supplychain-news.svg',
      author: 'Tom Becker',
      readTime: '5 min read',
      claps: 720
    },
    {
      id: 12,
      title: 'Tech Startups Focus on AI Safety',
      description: 'New initiatives aim to make AI models more transparent and secure.',
      category: 'Technology',
      date: 'Nov 05, 2025',
      image: '/images/ai-news.svg',
      author: 'Maya Singh',
      readTime: '8 min read',
      claps: 2920
    }
    ,
    {
      id: 13,
      title: 'Renewable Energy Investment Climbs',
      description: 'Investors increase funding in solar and wind projects worldwide.',
      category: 'Energy',
      date: 'Nov 04, 2025',
      image: '/images/energy-news.svg',
      author: 'Carlos Vega',
      readTime: '6 min read',
      claps: 810
    },
    {
      id: 14,
      title: 'Retail Sales Beat Expectations',
      description: 'Consumer spending remains strong as holiday season approaches.',
      category: 'Markets',
      date: 'Nov 03, 2025',
      image: '/images/market-news.svg',
      author: 'Nora Patel',
      readTime: '5 min read',
      claps: 430
    },
    {
      id: 15,
      title: 'Breakthrough in Cancer Research',
      description: 'Scientists report promising results from a new targeted therapy.',
      category: 'Health',
      date: 'Nov 02, 2025',
      image: '/images/health-news.svg',
      author: 'Dr. Alan Cho',
      readTime: '9 min read',
      claps: 2200
    },
    {
      id: 16,
      title: 'Logistics Firms Adopt Automation',
      description: 'Robotics and AI streamline warehouse operations and delivery.',
      category: 'Logistics',
      date: 'Nov 01, 2025',
      image: '/images/supplychain-news.svg',
      author: 'Greta Olson',
      readTime: '4 min read',
      claps: 610
    },
    {
      id: 17,
      title: 'New Regulations Impact Crypto Exchanges',
      description: 'Policy changes force exchanges to strengthen compliance programs.',
      category: 'Crypto',
      date: 'Oct 31, 2025',
      image: '/images/crypto-news.svg',
      author: 'Samir Rao',
      readTime: '7 min read',
      claps: 975
    },
    {
      id: 18,
      title: 'AI Tools Improve Small Business Operations',
      description: 'Affordable AI tools help small businesses optimize customer service.',
      category: 'Technology',
      date: 'Oct 30, 2025',
      image: '/images/tech-news.svg',
      author: 'Lina Hsu',
      readTime: '5 min read',
      claps: 345
    },
    {
      id: 19,
      title: 'Housing Starts Increase in Suburbs',
      description: 'New home construction picks up as developers target suburban markets.',
      category: 'Real Estate',
      date: 'Oct 29, 2025',
      image: '/images/realestate-news.svg',
      author: 'Ethan Brooks',
      readTime: '6 min read',
      claps: 512
    },
    {
      id: 20,
      title: 'Automakers Expand EV Charging Networks',
      description: 'Collaborations aim to speed up charging accessibility across regions.',
      category: 'Automotive',
      date: 'Oct 28, 2025',
      image: '/images/ev-news.svg',
      author: 'Rafael Costa',
      readTime: '5 min read',
      claps: 1225
    }
  ]

  const toggleLike = (id) => {
    setLikedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // debounce the search input to avoid re-computing on every keystroke
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

    // Helper: highlight matched tokens in a piece of text
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

  const filtered = useMemo(() => {
    if (!tokens.length) return newsArticles

    return newsArticles.filter((a) => {
      // Build searchable fields
      const title = normalize(a.title)
      const desc = normalize(a.description)
      const author = normalize(a.author)
      const category = normalize(a.category)
      const readTime = String(a.readTime || '')
      const claps = String(a.claps || '')

      // For each token, require it to match at least one field
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

  // Keep Featured constant (always the first article) and only change the
  // main feed when a search is active. Trending should also remain fixed.
  const featuredArticle = newsArticles[0]
  const feedArticles = tokens.length ? filtered : newsArticles.slice(1)

  // Pagination state: 5 articles per page in the main feed
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Reset to first page when the search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedQuery])

  const totalItems = feedArticles.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Ensure current page is valid if the filtered set shrinks
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * pageSize
    return feedArticles.slice(start, start + pageSize)
  }, [feedArticles, page])

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
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{featuredArticle.author}</p>
                      <p className="text-sm text-gray-600">{featuredArticle.date} • {featuredArticle.readTime}</p>
                    </div>
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
                      </h3>
                      <p className="text-gray-600 text-base mb-4 line-clamp-2">
                        {highlight(article.description, tokens)}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{article.author}</p>
                            <p className="text-xs text-gray-600">{article.date} • {article.readTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLike(article.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Heart
                              size={16}
                              className={likedArticles[article.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                            />
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
                <div className="space-y-6">
                  {newsArticles.slice(0, 3).map((article, index) => (
                    <div key={article.id} className="group cursor-pointer">
                      <p className="text-sm font-bold text-gray-600 mb-1">{index + 1}</p>
                      <h4 className="font-bold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        by <span className="font-medium">{article.author}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            

              {/* Newsletter Section */}
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Stay updated with the latest financial news and market insights
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button className="w-full px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
