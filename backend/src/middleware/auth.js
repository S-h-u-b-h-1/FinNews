import jwt from 'jsonwebtoken'

const TOKEN_COOKIE_NAMES = ['token', 'admin_token']

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  if (req.cookies) {
    for (const name of TOKEN_COOKIE_NAMES) {
      if (req.cookies[name]) return req.cookies[name]
    }
  }
  return null
}

export const protect = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth error:', error.message)
    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    })
  }
}

export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const authenticate = protect