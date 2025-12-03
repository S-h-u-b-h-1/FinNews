import jwt from 'jsonwebtoken';

// In-memory token blacklist (use Redis in production)
const tokenBlacklist = new Set();

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: 'Token is blacklisted' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// For backward compatibility
export const authenticate = protect;

export { tokenBlacklist };