import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Turn One Video Into
              <span className="text-blue-600"> A Week's Content</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your long-form video and let AI automatically extract highlights, generate shorts, blog posts, and social media content. Save 70% of your content creation time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Start Free Trial
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                Watch Demo
              </Button>
            </div>
            {!isSignedIn && (
              <p className="mt-4 text-sm text-gray-500">No credit card required. 3 free videos per month.</p>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Upload Your Video', description: 'Paste a YouTube URL or upload your video file directly.', icon: '📤' },
                { title: 'AI Analyzes Content', description: 'Our AI transcribes, identifies key moments, and finds engaging highlights.', icon: '🧠' },
                { title: 'Get Multiple Formats', description: 'Download clips for shorts, copy-paste blog posts, Twitter threads.', icon: '📦' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'AI Highlight Detection', description: 'Automatically find the most engaging moments.' },
                { title: 'Auto Transcription', description: 'Get accurate transcripts with timestamps.' },
                { title: 'Short Clips', description: 'Generate 30-60 second clips for TikTok, Reels, Shorts.' },
                { title: 'Blog Posts', description: 'SEO-optimized blog drafts with key insights.' },
                { title: 'Twitter Threads', description: 'Engaging threads with hooks and CTAs.' },
                { title: 'LinkedIn Posts', description: 'Professional posts for B2B audiences.' },
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">See It In Action</h2>
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center max-w-4xl mx-auto">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-xl">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-blue-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {isSignedIn ? 'Ready to Create More Content?' : 'Ready to 10x Your Content Output?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {isSignedIn ? 'Start repurposing your videos now.' : 'Join creators who save hours every week with RepurposeAI.'}
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(isSignedIn ? '/dashboard' : '/signup')}
            >
              {isSignedIn ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
