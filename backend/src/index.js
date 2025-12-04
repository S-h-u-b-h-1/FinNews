import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import newsRoutes from './routes/newsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Configure CORS to allow your frontend origin(s).
// Default to the deployed frontend URL; override with FRONTEND_URL env var
// during development (e.g. "http://localhost:3000" or "http://localhost:3001").
// To allow multiple origins in development, set FRONTEND_URL to a comma-separated list.
const FRONTEND_URL_RAW = process.env.FRONTEND_URL || 'https://fin-news-9jix.vercel.app'
const allowedOrigins = FRONTEND_URL_RAW.split(',').map(s => s.trim()).filter(Boolean)

// Add common localhost ports for development
const devOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
]

// Combine allowed origins with dev origins
const allAllowedOrigins = [...allowedOrigins, ...devOrigins]

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or server-to-server)
    if (!origin) return callback(null, true)
    if (allAllowedOrigins.includes(origin)) return callback(null, true)
    // In development, also allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
      return callback(null, true)
    }
    return callback(new Error('CORS not allowed by server'))
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

// Also respond to preflight requests for any route
app.options('*', cors())
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Finnews API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/news', newsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
