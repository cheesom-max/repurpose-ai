import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/layout/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login/*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <SignIn routing="path" path="/login" signUpUrl="/signup" />
          </div>
        }
      />
      <Route
        path="/signup/*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <SignUp routing="path" path="/signup" signInUrl="/login" />
          </div>
        }
      />
      <Route path="/pricing" element={<Pricing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <NewProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
