import { Router } from 'express'
import authRoutes from './authRoutes.js'
import newsRoutes from './newsRoutes.js'

const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Routes
router.use('/api/auth', authRoutes)
router.use('/api/news', newsRoutes)

// API welcome message
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Finnews API' })
})

// Mount auth routes
router.use('/auth', authRoutes)

export default router
