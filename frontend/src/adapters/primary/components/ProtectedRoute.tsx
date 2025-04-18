import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, fetchCurrentUser, isLoading } = useAuthStore();
  const location = useLocation();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    // Only attempt to fetch if we haven't tried yet and we're not authenticated
    if (!isAuthenticated && !isLoading && !user && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      fetchCurrentUser().catch(error => {
        console.error('Error fetching current user:', error);
        // Don't set hasAttemptedFetch to false here to prevent infinite retries
      });
    }
  }, [isAuthenticated, fetchCurrentUser, isLoading, user, hasAttemptedFetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;