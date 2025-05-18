import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({ 
  id = 'password',
  placeholder = 'กรอกรหัสผ่าน',
  showPassword = false, 
  setShowPassword = () => {}, 
  onChange = () => {},
  value = ''
}) => {
  const handleTogglePassword = () => {
    if (typeof setShowPassword === 'function') {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder={placeholder}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition"
        onClick={handleTogglePassword}
        aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

export default PasswordInput;