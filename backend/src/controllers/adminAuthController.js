import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cookieOptions = {
  httpOnly: true,
  // When running in production the frontend and backend are often on different
  // origins (cross-site). For cookies to be sent with cross-site XHR/fetch
  // requests we must set `sameSite: 'none'` and `secure: true`.
  // During development keep `lax` to make local testing easier.
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const formatUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
})

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  )

const sendAuthResponse = (user, res, status = 200) => {
  const token = signToken(user)
  res.cookie('admin_token', token, cookieOptions)
  res.status(status).json({
    message: status === 201 ? 'Admin account created' : 'Authenticated',
    user: formatUser(user)
  })
}

export const adminSignup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password required')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409)
    throw new Error('User already exists. Please log in.')
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'admin'
    }
  })

  sendAuthResponse(user, res, 201)
})

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password required')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(404)
    throw new Error('Account not found. Please sign up.')
  }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  // Only users that already have admin role can log in here.
  // Normal users must log in via the main login page.
  if (user.role !== 'admin') {
    res.status(403)
    throw new Error('You are not registered as an admin. Please log in from the main page.')
  }

  sendAuthResponse(user, res, 200)
})

export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie('admin_token', { ...cookieOptions, maxAge: 0 })
  res.json({ message: 'Logged out' })
})

export const adminProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: { id: true, email: true, name: true, role: true }
  })
  if (!user || user.role !== 'admin') {
    res.status(403)
    throw new Error('Admin access required')
  }
  res.json({ user })
})

