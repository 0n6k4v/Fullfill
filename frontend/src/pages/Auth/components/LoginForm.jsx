import React from 'react';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import PasswordInput from './PasswordInput';
import SocialButton from './SocialButton';

const LoginForm = ({ 
  showPassword, 
  setShowPassword, 
  setActiveTab 
}) => {
  return (
    <form className="space-y-6">
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
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="remember"
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
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium !rounded-button whitespace-nowrap cursor-pointer"
      >
        Log In
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