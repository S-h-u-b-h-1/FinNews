import { Link } from 'react-router-dom'

export default function PreLogin() {
  return (
    <div className="min-h-screen bg-white flex items-center">
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Finnews</h1>
        <p className="text-gray-600 mb-6">Get the latest financial news and market insights. Sign up to personalize your feed and access the dashboard.</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 bg-black text-white rounded-lg font-medium">Get Started</Link>
          <Link to="/login" className="px-6 py-3 border border-black rounded-lg font-medium">Sign in</Link>
        </div>
      </main>
    </div>
  )
}
