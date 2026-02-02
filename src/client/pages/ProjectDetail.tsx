import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../lib/api';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

interface Project {
  id: string;
  title: string;
  sourceType: string;
  sourceUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transcript?: { text: string };
  createdAt: string;
  clips?: Clip[];
  contents?: Content[];
}

interface Clip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  score: string;
}

interface Content {
  id: string;
  type: string;
  title?: string;
  content: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  // Polling for processing status
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (processing && id) {
      intervalId = setInterval(async () => {
        try {
          const data = await projectsApi.get(id);
          if (data.status === 'completed' || data.status === 'failed') {
            setProject(data);
            setProcessing(false);
          }
        } catch {
          // Ignore polling errors
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [processing, id]);

  const fetchProject = async () => {
    try {
      const data = await projectsApi.get(id!);
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    setError(null);

    try {
      await projectsApi.process(id!);
      // Polling will handle the rest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProcessing(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <h2 className="text-xl text-gray-600">Project not found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const clips = project.clips || [];
  const contents = project.contents || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center">
              ← Back to Projects
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-500">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {(project.status === 'pending' || project.status === 'failed') && (
            <Button onClick={handleProcess} isLoading={processing}>
              Start Processing
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {(project.status === 'processing' || processing) && (
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing your video...</h3>
              <p className="text-gray-500">This may take a few minutes.</p>
            </CardContent>
          </Card>
        )}

        {project.status === 'pending' && !processing && (
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to process</h3>
              <p className="text-gray-500">Click "Start Processing" to begin.</p>
            </CardContent>
          </Card>
        )}

        {project.status === 'completed' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Clips ({clips.length})</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clips.map((clip) => (
                  <Card key={clip.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{clip.title || 'Clip'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        {Math.floor(clip.startTime / 60)}:{String(clip.startTime % 60).padStart(2, '0')} -
                        {Math.floor(clip.endTime / 60)}:{String(clip.endTime % 60).padStart(2, '0')}
                      </p>
                      {clip.score && <p className="text-sm text-gray-500">Score: {(parseFloat(clip.score) * 100).toFixed(0)}%</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Content ({contents.length})</h2>
              <div className="space-y-4">
                {contents.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <CardTitle className="text-base capitalize">{content.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{content.content}</pre>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigator.clipboard.writeText(content.content)}
                      >
                        Copy
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {project.transcript && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Transcript</h2>
                <Card>
                  <CardContent className="py-4">
                    <div className="max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.transcript.text}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
