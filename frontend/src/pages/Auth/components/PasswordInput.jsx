import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({ 
  id, 
  placeholder, 
  showPassword, 
  setShowPassword, 
  onChange 
}) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder={placeholder}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};

export default PasswordInput;