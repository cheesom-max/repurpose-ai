import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../lib/api';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function NewProject() {
  const navigate = useNavigate();

  const [sourceType, setSourceType] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (sourceType === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;
      if (!youtubeRegex.test(youtubeUrl)) {
        setError('Please enter a valid YouTube URL');
        setIsLoading(false);
        return;
      }
    }

    try {
      const data = await projectsApi.create({
        title: title || 'Untitled Project',
        sourceType,
        sourceUrl: sourceType === 'youtube' ? youtubeUrl : undefined,
      });

      navigate(`/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
          <p className="text-gray-500 mt-1">Add a video to repurpose into multiple content formats</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Source</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSourceType('youtube')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    sourceType === 'youtube' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📺</div>
                  <span className="font-medium text-gray-900">YouTube URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType('upload')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    sourceType === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📤</div>
                  <span className="font-medium text-gray-900">Upload File</span>
                </button>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Video"
                />
              </div>

              {sourceType === 'youtube' && (
                <div>
                  <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <Input
                    id="youtube-url"
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
              )}

              {sourceType === 'upload' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-gray-500 mb-2">File upload coming soon!</p>
                  <p className="text-sm text-gray-400">For now, please use a YouTube URL</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isLoading} disabled={sourceType === 'upload'}>
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
