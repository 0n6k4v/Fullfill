import React, { useState } from 'react';
import { faGoogle, faFacebook, faLine, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialButton from './SocialButton';
import axios from 'axios';

const RegisterForm = ({ 
  showPassword = false, 
  setShowPassword = () => {}, 
  passwordStrength = 0, 
  handlePasswordChange = () => {}, 
  setActiveTab = () => {} 
}) => {
  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // สร้าง state แยกสำหรับข้อมูลติดต่อที่หลากหลาย
  const [contactInfo, setContactInfo] = useState([
    { type: 'phone', value: '', label: 'เบอร์โทรศัพท์' }
  ]);
  
  // state สำหรับจัดการข้อความ error และ loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // ตัวเลือกประเภทการติดต่อ
  const contactTypes = [
    { id: 'phone', label: 'เบอร์โทรศัพท์' },
    { id: 'line', label: 'LINE ID' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'other', label: 'อื่นๆ' }
  ];
  
  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    if (!e || !e.target) return;
    
    const { id, value, type, checked } = e.target;
    
    // ถ้ามีการเปลี่ยนแปลงที่ password เรียกใช้ handlePasswordChange
    if (id === 'register-password') {
      handlePasswordChange(e);
    }
    
    setFormData(prev => ({
      ...prev,
      [id === 'register-email' ? 'email' : 
        id === 'register-password' ? 'password' : 
        id === 'confirm-password' ? 'confirmPassword' :
        id === 'username' ? 'username' :
        id === 'terms' ? 'agreeTerms' : id]: type === 'checkbox' ? checked : value
    }));
  };
  
  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลติดต่อ
  const handleContactChange = (index, field, value) => {
    if (typeof index !== 'number' || !field || value === undefined) return;
    
    const newContactInfo = [...contactInfo];
    newContactInfo[index][field] = value;
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันเพิ่มฟิลด์ข้อมูลติดต่อใหม่
  const addContactField = () => {
    setContactInfo([...contactInfo, { type: 'phone', value: '', label: 'เบอร์โทรศัพท์' }]);
  };
  
  // ฟังก์ชันลบฟิลด์ข้อมูลติดต่อ
  const removeContactField = (index) => {
    if (typeof index !== 'number') return;
    
    const newContactInfo = [...contactInfo];
    newContactInfo.splice(index, 1);
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนประเภทการติดต่อ
  const handleContactTypeChange = (index, type) => {
    if (typeof index !== 'number' || !type) return;
    
    const selectedType = contactTypes.find(t => t.id === type);
    if (!selectedType) return;
    
    const newContactInfo = [...contactInfo];
    newContactInfo[index].type = type;
    newContactInfo[index].label = selectedType.label;
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันสำหรับ validate ข้อมูล
  const validateForm = () => {
    if (!formData.email?.trim()) return "กรุณากรอกอีเมล";
    if (!formData.username?.trim()) return "กรุณากรอกชื่อผู้ใช้";
    if (!formData.password) return "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword) return "รหัสผ่านไม่ตรงกัน";
    if (!formData.agreeTerms) return "กรุณายอมรับเงื่อนไขการใช้งาน";
    if (passwordStrength < 2) return "กรุณาใช้รหัสผ่านที่แข็งแกร่งกว่า";
    return null;
  };
  
  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    if (!e) return;
    e.preventDefault();
    
    // เพิ่ม console.log เพื่อ debugging
    console.log("Form submitted", formData);
    console.log("Contact info", contactInfo);
    
    // ตรวจสอบความถูกต้องของข้อมูล
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      console.log("Validation error:", validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // กำหนด API URL
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`;
      console.log("Sending request to:", apiUrl);
      
      // แปลงข้อมูลติดต่อเป็นรูปแบบที่เหมาะสมสำหรับ API
      const formattedContactInfo = {};
      
      // กรองเฉพาะข้อมูลที่มีค่า
      contactInfo.forEach(contact => {
        if (contact.value && contact.value.trim() !== '') {
          formattedContactInfo[contact.type] = contact.value.trim();
        }
      });
      
      // ส่งข้อมูลไปยัง API
      const response = await axios.post(
        apiUrl, 
        {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          contact_info: formattedContactInfo
        }
      );
      
      console.log("Response:", response.data);
      
      // บันทึก token ใน localStorage หรือ cookies (ถ้ามี)
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      
      // แสดงข้อความสำเร็จและเปลี่ยนไปหน้า login
      setSuccess(true);
      setTimeout(() => {
        setActiveTab("login");
      }, 2000);
      
    } catch (err) {
      // จัดการกับข้อผิดพลาด
      console.error("Error:", err);
      
      if (err.response && err.response.data) {
        console.error("API error response:", err.response.data);
        
        // จัดการกับข้อผิดพลาดแบบ validation error จาก FastAPI
        if (err.response.data.detail && Array.isArray(err.response.data.detail)) {
          const errorMessages = err.response.data.detail.map(error => error.msg).join(", ");
          setError(errorMessages);
        } else {
          // แสดงข้อความ error จาก API
          setError(err.response.data.detail || "การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* แสดงข้อความ error ถ้ามี */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* แสดงข้อความสำเร็จถ้าลงทะเบียนสำเร็จ */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          ลงทะเบียนสำเร็จ! กำลังเปลี่ยนไปหน้าเข้าสู่ระบบ...
        </div>
      )}
      
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ชื่อผู้ใช้
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="เลือกชื่อผู้ใช้"
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          อีเมล
        </label>
        <input
          type="email"
          id="register-email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="กรอกอีเมลของคุณ"
        />
      </div>
      
      {/* Contact Information - Dynamic Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ข้อมูลการติดต่อ (ไม่บังคับ)
        </label>
        
        {contactInfo.map((contact, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3">
            {/* Dropdown แบบเต็มหน้าจอบนมือถือ */}
            <select
              value={contact.type}
              onChange={(e) => handleContactTypeChange(index, e.target.value)}
              className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {contactTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={contact.value}
              onChange={(e) => handleContactChange(index, 'value', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder={`กรอก${contact.label}`}
            />
            
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeContactField(index)}
                className="p-3 text-gray-500 hover:text-red-500 transition"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addContactField}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          เพิ่มช่องทางการติดต่อ
        </button>
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          รหัสผ่าน
        </label>
        <PasswordInput
          id="register-password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <PasswordStrengthMeter strength={passwordStrength} />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ยืนยันรหัสผ่าน
        </label>
        <PasswordInput
          id="confirm-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          ฉันยอมรับ{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            เงื่อนไขการใช้งาน
          </a>{' '}
          และ{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            นโยบายความเป็นส่วนตัว
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">หรือลงทะเบียนด้วย</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton
          icon={faGoogle}
          text="Google"
          onClick={() => console.log('Google sign up clicked')}
        />
        <SocialButton
          icon={faFacebook}
          text="Facebook"
          onClick={() => console.log('Facebook sign up clicked')}
        />
        <SocialButton
          icon={faLine}
          text="LINE"
          onClick={() => console.log('LINE sign up clicked')}
        />
        <SocialButton
          icon={faTwitter}
          text="Twitter"
          onClick={() => console.log('Twitter sign up clicked')}
        />
      </div>
    </form>
  );
};

export default RegisterForm;