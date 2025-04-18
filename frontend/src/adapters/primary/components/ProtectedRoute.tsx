import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, user, fetchCurrentUser, isLoading } = useAuth();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading && !hasAttemptedFetch) {
        try {
          await fetchCurrentUser();
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          setHasAttemptedFetch(true);
        }
      }
    };
    checkAuth();
  }, [isAuthenticated, isLoading, hasAttemptedFetch, fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;