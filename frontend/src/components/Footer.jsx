export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-gray-900 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Follow</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">&copy; 2025 Finnews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
