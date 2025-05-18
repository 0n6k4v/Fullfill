'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import PasswordInput from './PasswordInput';
import SocialButton from './SocialButton';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ใช้ try-catch เพื่อป้องกันกรณีที่ AuthProvider ไม่มีอยู่
  let login = async () => {};
  try {
    const { login: authLogin } = useAuth();
    login = authLogin;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            อีเมล
          </label>
          <div className="relative">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            รหัสผ่าน
          </label>
          <PasswordInput
            value={formData.password}
            onChange={handleChange}
            name="password"
            id="password"
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              จดจำฉัน
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              ลืมรหัสผ่าน?
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">หรือ</span>
            </div>
          </div>
          <SocialButton
            provider="google"
            text="เข้าสู่ระบบด้วย Google"
          />
          <SocialButton
            provider="facebook"
            text="เข้าสู่ระบบด้วย Facebook"
          />
        </div>
      </form>
      <p className="text-center text-gray-600 text-sm">
        ยังไม่มีบัญชี?{' '}
        <a href="/Auth/register" className="text-blue-600 hover:text-blue-800">
          สมัครสมาชิก
        </a>
      </p>
    </div>
  );
};

export default LoginForm;