import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '../ui/Button';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">RepurposeAI</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
              <Button onClick={() => navigate('/signup')}>Get Started</Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
