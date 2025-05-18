"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  let isAuthenticated = () => false;
  let loading = false;
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    loading = auth.loading;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    router.push('/Auth');
    return null;
  }

  return children;
};

export default ProtectedRoute;