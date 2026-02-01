import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">RepurposeAI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Transform your long-form content into multiple formats with AI.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/#features" className="text-sm text-gray-500 hover:text-gray-900">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} RepurposeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
