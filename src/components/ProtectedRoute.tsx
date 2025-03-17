import {Navigate} from 'react-router-dom';
import {useEffect, useState} from "react";

import {useAuth} from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  isPaid?: boolean;
}

export default function ProtectedRoute({children, requireAuth = true, isPaid = false}: ProtectedRouteProps) {
  const {user, loading} = useAuth();
  const [isFreeTier, setIsFreeTier] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // useEffect(() => {
  //   console.log("Auth State:", {user, loading});
  // }, [user, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const calculationCount: number = parseInt(sessionStorage.getItem('calculationCount') || '0');
    setIsFreeTier(calculationCount < 3);
  }, []);

  if (loading && !timeoutReached && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user && !isPaid && (!isFreeTier || requireAuth)) {
    return <Navigate to="/signin"/>;
  }

  return <>{children}</>;
}
