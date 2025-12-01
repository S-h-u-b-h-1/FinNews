import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Contact page removed — redirect to home for safety if route is accidentally used
export default function Contact() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])
  return null
}
