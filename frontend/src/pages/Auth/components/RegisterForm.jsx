import React, { useState } from 'react';
import { faGoogle, faFacebook, faLine, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialButton from './SocialButton';
import axios from 'axios';

const RegisterForm = ({ 
  showPassword, 
  setShowPassword, 
  passwordStrength, 
  handlePasswordChange, 
  setActiveTab 
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
    { type: 'phone', value: '', label: 'Phone' }
  ]);
  
  // state สำหรับจัดการข้อความ error และ loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // ตัวเลือกประเภทการติดต่อ
  const contactTypes = [
    { id: 'phone', label: 'Phone' },
    { id: 'line', label: 'LINE ID' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'other', label: 'Other' }
  ];
  
  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
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
    const newContactInfo = [...contactInfo];
    newContactInfo[index][field] = value;
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันเพิ่มฟิลด์ข้อมูลติดต่อใหม่
  const addContactField = () => {
    setContactInfo([...contactInfo, { type: 'phone', value: '', label: 'Phone' }]);
  };
  
  // ฟังก์ชันลบฟิลด์ข้อมูลติดต่อ
  const removeContactField = (index) => {
    const newContactInfo = [...contactInfo];
    newContactInfo.splice(index, 1);
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนประเภทการติดต่อ
  const handleContactTypeChange = (index, type) => {
    const selectedType = contactTypes.find(t => t.id === type);
    const newContactInfo = [...contactInfo];
    newContactInfo[index].type = type;
    newContactInfo[index].label = selectedType.label;
    setContactInfo(newContactInfo);
  };
  
  // ฟังก์ชันสำหรับ validate ข้อมูล
  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required";
    if (!formData.username.trim()) return "Username is required";
    if (!formData.password) return "Password is required";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!formData.agreeTerms) return "You must agree to the Terms of Service";
    if (passwordStrength < 2) return "Please use a stronger password";
    return null;
  };
  
  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
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
          setError(err.response.data.detail || "Registration failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
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
          Registration successful! Redirecting to login...
        </div>
      )}
      
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Choose a username"
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="register-email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Enter your email"
        />
      </div>
      
      {/* Contact Information - Dynamic Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Information (Optional)
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
            
            {/* Input field กับปุ่มลบในแนวนอนเสมอ */}
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={contact.value}
                onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                placeholder={`Enter your ${contact.label}`}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              
              {contactInfo.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContactField(index)}
                  className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                  aria-label="Remove contact field"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {contactInfo.length < 5 && (
          <button
            type="button"
            onClick={addContactField}
            className="mt-1 flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add another contact method
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <PasswordInput
          id="register-password"
          placeholder="Create a password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onChange={(e) => {
            handlePasswordChange(e);
            handleChange(e);
          }}
          value={formData.password}
        />
        <PasswordStrengthMeter strength={passwordStrength} />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="confirm-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Confirm your password"
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label
          htmlFor="terms"
          className="ml-2 block text-sm text-gray-700"
        >
          I agree to the{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium !rounded-button whitespace-nowrap cursor-pointer ${loading ? 'opacity-70' : ''}`}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* ส่วนที่เหลือคงเหมือนเดิม */}
      <div className="relative flex items-center justify-center mt-6">
        <div className="absolute w-full border-t border-gray-300"></div>
        <div className="relative px-4 bg-white text-sm text-gray-500">
          Or sign up with
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
        Already have an account?
        <button
          type="button"
          className="text-indigo-600 font-medium ml-1 hover:text-indigo-500 cursor-pointer"
          onClick={() => setActiveTab("login")}
        >
          Log In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;