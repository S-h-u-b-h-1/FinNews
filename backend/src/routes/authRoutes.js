import { Router } from 'express'
import { signup, login, logout, getCurrentUser } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post('/signup', signup)
router.post('/login', login)

// Protected routes
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getCurrentUser)

export default router
