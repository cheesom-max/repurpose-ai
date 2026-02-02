import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { projectsApi } from '../lib/api';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

interface Project {
  id: string;
  title: string;
  sourceType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  duration?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetchProjects();
    }
  }, [isSignedIn]);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-500 mt-1">Transform your videos into multiple content formats</p>
          </div>
          <Button onClick={() => navigate('/projects/new')}>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first project</p>
              <Button onClick={() => navigate('/projects/new')}>Create Your First Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span>{project.sourceType === 'youtube' ? '📺 YouTube' : '📁 Upload'}</span>
                      </div>
                      <div className="flex items-center">
                        <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
