import { Link } from 'react-router-dom'

export default function PewLogin() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Welcome to FinNews</h1>
            <p className="text-lg text-gray-600 mb-8">Timely, unbiased financial news and analysis that helps you make better decisions.</p>
            <div className="flex gap-4">
              <Link to="/login" className="px-6 py-3 bg-black text-white rounded-md font-medium">Login</Link>
              <Link to="/signup" className="px-6 py-3 border border-gray-200 rounded-md font-medium text-gray-700">Sign up</Link>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
            <img src="/images/finnews-logo.svg" alt="Finnews logo" className="h-48 w-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
