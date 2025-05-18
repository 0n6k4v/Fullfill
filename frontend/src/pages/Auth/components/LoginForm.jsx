import React, { useState } from 'react';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import PasswordInput from './PasswordInput';
import SocialButton from './SocialButton';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginForm = ({ 
  showPassword, 
  setShowPassword, 
  setActiveTab 
}) => {
  const { login, error: authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // state สำหรับจัดการข้อความ error และ loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'email' ? 'email' : id]: type === 'checkbox' ? checked : value
    }));
  };
  
  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ใช้ฟังก์ชัน login จาก AuthContext
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // เช็คว่ามี returnUrl หรือไม่
        const returnUrl = searchParams.get('returnUrl') || '/';
        router.push(returnUrl);
      } else {
        setError(authError || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* แสดงข้อความ error ถ้ามี */}
      {(error || authError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || authError}
        </div>
      )}
      
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium !rounded-button whitespace-nowrap cursor-pointer ${loading ? 'opacity-70' : ''}`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <div className="relative flex items-center justify-center mt-6">
        <div className="absolute w-full border-t border-gray-300"></div>
        <div className="relative px-4 bg-white text-sm text-gray-500">
          Or continue with
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SocialButton 
          icon={faGoogle} 
          platform="Google" 
          color="text-red-500" 
        />
        <SocialButton 
          icon={faFacebook} 
          platform="Facebook" 
          color="text-blue-600" 
        />
      </div>

      <p className="text-center text-gray-600 mt-6">
        Don't have an account?
        <button
          type="button"
          className="text-indigo-600 font-medium ml-1 hover:text-indigo-500 cursor-pointer"
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default LoginForm;