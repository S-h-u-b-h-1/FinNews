import { Router } from 'express'
import { admin, authenticate } from '../middleware/auth.js'
import { adminLogin, adminLogout, adminProfile, adminSignup } from '../controllers/adminAuthController.js'

const router = Router()

router.post('/signup', adminSignup)
router.post('/login', adminLogin)
router.post('/logout', authenticate, admin, adminLogout)
router.get('/me', authenticate, admin, adminProfile)

export default router

