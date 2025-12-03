import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const signup = async (req, res) => {
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
}

export const login = async (req, res) => {
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
}

export const logout = (req, res) => {
  const authHeader = req.headers.authorization || ''
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const token = tokenFromHeader || req.body.token
  if (!token) return res.status(400).json({ error: 'Token required' })

  // Add token to blacklist (in a real app, you'd want to use Redis or similar)
  // tokenBlacklist.add(token)
  return res.json({ message: 'Logged out' })
}

export const getCurrentUser = async (req, res) => {
  const userId = req.user.sub
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { id: true, email: true, name: true } 
  })
  return res.json({ user })
}
