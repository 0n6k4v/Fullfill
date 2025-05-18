"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await api.get(`/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            setUser(response.data);
          } catch (error) {
            console.log("Invalid or expired token");
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post(
        `/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        const userResponse = await api.get(`/users/me`, {
          headers: {
            'Authorization': `Bearer ${response.data.access_token}`
          }
        });
        
        setUser(userResponse.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || "Login failed");
      } else {
        setError("Network error. Please check your connection.");
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};