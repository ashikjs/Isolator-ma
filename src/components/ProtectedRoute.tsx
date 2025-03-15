import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const calculationCount = parseInt(sessionStorage.getItem('calculationCount') || '0');
  const isFreeTier = calculationCount < 3;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Allow access if:
  // 1. User is authenticated, OR
  // 2. It's free tier and auth is not explicitly required
  if (!user && (!isFreeTier || requireAuth)) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}