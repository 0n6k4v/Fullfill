"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // ตั้งค่า token ใน header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/users/me');
        if (response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });

      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token } = response.data;
      
      // ตั้งค่า token ใน header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      const userResponse = await api.get('/users/me');
      
      setUser(userResponse.data);
      router.push('/User/MyProfile');
      return { success: true };
    } catch (error) {
      console.error('Login failed with error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      return { 
        success: false, 
        error: error.response?.data?.detail || 'เข้าสู่ระบบไม่สำเร็จ' 
      };
    }
  };

  const register = async (userData) => {
    try {

      const response = await api.post('/auth/register', userData);

      const { access_token, refresh_token } = response.data;
      
      // ตั้งค่า token ใน header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      const userResponse = await api.get('/users/me');
      
      setUser(userResponse.data);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Registration failed with error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });

      return { 
        success: false, 
        error: error.response?.data?.detail || 'ลงทะเบียนไม่สำเร็จ' 
      };
    }
  };

  const logout = () => {
    // ลบ token จาก header
    delete api.defaults.headers.common['Authorization'];
    
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
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}