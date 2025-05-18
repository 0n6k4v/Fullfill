import React, { useState } from 'react';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import PasswordInput from './PasswordInput';
import SocialButton from './SocialButton';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginForm = ({ 
  showPassword = false, 
  setShowPassword = () => {}, 
  setActiveTab = () => {} 
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
    if (!e || !e.target) return;
    
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'email' ? 'email' : id]: type === 'checkbox' ? checked : value
    }));
  };
  
  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    if (!e) return;
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!formData.email?.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }
    
    if (!formData.password) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ใช้ฟังก์ชัน login จาก AuthContext
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // เช็คว่ามี returnUrl หรือไม่
        const returnUrl = searchParams?.get('returnUrl') || '/';
        router.push(returnUrl);
      } else {
        setError(authError || "การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง");
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
          อีเมล
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="กรอกอีเมลของคุณ"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          รหัสผ่าน
        </label>
        <PasswordInput
          id="password"
          placeholder="กรอกรหัสผ่านของคุณ"
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
            จดจำฉัน
          </label>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ลืมรหัสผ่าน?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">หรือเข้าสู่ระบบด้วย</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton 
          icon={faGoogle} 
          text="Google"
          onClick={() => console.log('Google login clicked')}
          color="text-red-500"
        />
        <SocialButton 
          icon={faFacebook} 
          text="Facebook"
          onClick={() => console.log('Facebook login clicked')}
          color="text-blue-600"
        />
      </div>

      <p className="text-center text-gray-600 mt-6">
        ยังไม่มีบัญชี?
        <button
          type="button"
          className="text-indigo-600 font-medium ml-1 hover:text-indigo-500 cursor-pointer"
          onClick={() => setActiveTab("register")}
        >
          ลงทะเบียน
        </button>
      </p>
    </form>
  );
};

export default LoginForm;