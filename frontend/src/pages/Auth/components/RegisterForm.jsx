import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import PasswordInput from './PasswordInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialButton from './SocialButton';

const RegisterForm = ({ 
  showPassword, 
  setShowPassword, 
  passwordStrength, 
  handlePasswordChange, 
  setActiveTab 
}) => {
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="fullname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Enter your full name"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Enter your email"
        />
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
          onChange={handlePasswordChange}
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Confirm your password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-300 rounded-md p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
            <input
              type="radio"
              id="donor"
              name="user-type"
              className="sr-only"
            />
            <label
              htmlFor="donor"
              className="flex flex-col items-center cursor-pointer"
            >
              <FontAwesomeIcon 
                icon={faHandHoldingHeart} 
                className="text-2xl text-indigo-600 mb-2"
              />
              <span className="font-medium">Donor</span>
            </label>
          </div>
          <div className="border border-gray-300 rounded-md p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
            <input
              type="radio"
              id="recipient"
              name="user-type"
              className="sr-only"
            />
            <label
              htmlFor="recipient"
              className="flex flex-col items-center cursor-pointer"
            >
              <FontAwesomeIcon 
                icon={faBuilding} 
                className="text-2xl text-indigo-600 mb-2"
              />
              <span className="font-medium">Recipient</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
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
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium !rounded-button whitespace-nowrap cursor-pointer"
      >
        Create Account
      </button>

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