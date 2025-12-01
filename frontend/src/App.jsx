import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import ProtectedRoute from './components/ProtectedRoute'
import PreLogin from './pages/PreLogin'

export default function App() {
  function Root() {
    const [token, setToken] = useState(null)
    useEffect(() => {
      setToken(localStorage.getItem('token'))
    }, [])
    return token ? <Home /> : <PreLogin />
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/prelogin" element={<PreLogin />} />
        <Route path="/about" element={<About />} />
        {/* /dashboard removed — Home is used as the main authenticated page */}
      </Routes>
      <Footer />
    </Router>
  )
}
