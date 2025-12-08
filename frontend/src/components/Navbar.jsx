import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { API_BASE_URL } from '../config/env'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { token, logout, user } = useContext(AuthContext)
  const isAuth = Boolean(token)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path
  // Hide the global navbar on admin routes (dashboard and admin pages)
  if (location.pathname && location.pathname.startsWith('/admin')) return null

  

  return (
    <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuth ? "/home" : "/login"} className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">📰 FinNews</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuth && (
              <Link 
                to="/home" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/home') ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Dashboard
              </Link>
            )}
            {isAuth && (
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                About
              </Link>
            )}
            {!isAuth ? (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    isActive('/login') 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await fetch(`${API_BASE_URL}/api/auth/logout`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: token ? `Bearer ${token}` : ''
                      },
                      body: JSON.stringify({ token })
                    })
                  } catch (err) {
                    // logout API error (ignored)
                  }
                  logout()
                  navigate('/login')
                }}
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4 space-y-3">
            {isAuth && (
              <Link to="/home" className="block py-2 text-gray-700 hover:text-black font-medium">
                Dashboard
              </Link>
            )}
            {isAuth && (
              <Link to="/about" className="block py-2 text-gray-700 hover:text-black font-medium">
                About
              </Link>
            )}
            {!isAuth ? (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-black font-medium">
                  Login
                </Link>
                <Link to="/signup" className="block w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-center">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await fetch(`${API_BASE_URL}/api/auth/logout`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: token ? `Bearer ${token}` : ''
                      },
                      body: JSON.stringify({ token })
                    })
                  } catch (err) {
                    // logout API error (ignored)
                  }
                  logout()
                  navigate('/login')
                }}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
