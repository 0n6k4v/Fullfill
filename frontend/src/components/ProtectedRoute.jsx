"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push('/Auth');
      } else {
        setIsReady(true);
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;