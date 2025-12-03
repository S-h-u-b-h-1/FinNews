import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import newsRoutes from './routes/newsRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const prisma = new PrismaClient()

const tokenBlacklist = new Set()

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Finnews API' })
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      },
      select: { id: true, email: true, name: true }
    })

    return res.status(201).json({ message: 'User created', user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const payload = { sub: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || ''
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const token = tokenFromHeader || req.body.token
  if (!token) return res.status(400).json({ error: 'Token required' })

  tokenBlacklist.add(token)
  return res.json({ message: 'Logged out' })
})

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  if (tokenBlacklist.has(token)) return res.status(401).json({ error: 'Token is blacklisted' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

app.get('/api/me', authenticate, async (req, res) => {
  const userId = req.user.sub
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } })
  return res.json({ user })
})

// News routes
app.use('/api/news', newsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
