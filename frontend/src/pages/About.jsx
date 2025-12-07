import { CheckCircle } from 'lucide-react'

export default function About() {
  const values = [
    {
      title: 'Quality Content',
      description: 'We deliver accurate, well-researched financial news that matters.'
    },
    {
      title: 'Community First',
      description: 'Our platform empowers readers to engage and share insights.'
    },
    {
      title: 'Independence',
      description: 'We report freely without influence or bias.'
    },
    {
      title: 'Transparency',
      description: 'We disclose our sources and stand by our reporting.'
    }
  ]



  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About Finnews
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize financial news and empower investors with accurate, timely information.
          </p>
        </div>

        {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 border-b border-gray-200 pb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Finnews was founded in 2025 with a simple vision: to make financial news accessible, reliable, and engaging for everyone.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We noticed that quality financial information was often locked behind paywalls or written in jargon that ordinary people couldn't understand. We decided to change that.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, Finnews is trusted by thousands of readers who rely on our reporting to make informed financial decisions.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center p-8">
            <img src="/images/finnews-logo.svg" alt="Finnews logo" className="h-full max-w-full object-contain" />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="flex-shrink-0 text-black mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-b border-gray-200">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">50K+</p>
            <p className="text-gray-600">Daily Readers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">1000+</p>
            <p className="text-gray-600">Articles Published</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">25</p>
            <p className="text-gray-600">Expert Contributors</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to stay informed?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of readers who trust Finnews for their daily financial updates.
          </p>
        </div>
      </main>
    </div>
  )
}
