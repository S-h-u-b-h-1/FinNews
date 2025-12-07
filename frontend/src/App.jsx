import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import PewLogin from './pages/PewLogin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './context/AuthContext'
import CreatorAccess from './pages/CreatorAccess'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'

// Component to redirect based on auth status
function Root() {
  const { token } = useContext(AuthContext)
  return token ? <Navigate to="/home" replace /> : <PewLogin />
}

// Component to redirect authenticated users away from login/signup
function PublicRoute({ children }) {
  const { token } = useContext(AuthContext)
  return token ? <Navigate to="/home" replace /> : children
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route path="/creator" element={<CreatorAccess />} />
        <Route 
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/* Redirect any other routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  )
}
