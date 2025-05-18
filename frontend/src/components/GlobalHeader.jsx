"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';

const GlobalHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo และเมนูหลัก */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-8">
            <h1 className="text-2xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* แสดงเมนูตามสถานะการล็อกอิน */}
            {isAuthenticated() ? (
              <>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  Home
                </Link>
                <Link href="/Post" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  Post
                </Link>
                <Link href="/maps" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  Maps
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  Dashboard
                </Link>
              </>
            ) : (
              // Not logged in menu
              <>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  How It Works
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  About Us
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* ปุ่มและเมนูด้านขวา */}
        <div className="flex items-center space-x-4">
          {isAuthenticated() ? (
            // Logged in controls
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none">
                <FontAwesomeIcon icon={faBell} />
              </button>
              
              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      Your Profile
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Not logged in controls
            <div className="flex items-center space-x-3">
              <Link
                href="/auth"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer hidden sm:inline-block"
              >
                Log In
              </Link>
              <Link
                href="/auth?tab=register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* แสดงเมนูตามสถานะการล็อกอิน */}
            {isAuthenticated() ? (
              // Logged in mobile menu
              <>
                <Link 
                  href="/"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/Post"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Post
                </Link>
                <Link 
                  href="/maps"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Maps
                </Link>
                <Link 
                  href="/dashboard"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // Not logged in mobile menu
              <>
                <Link 
                  href="/how-it-works"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="/about"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/auth"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/auth?tab=register"
                  className="block text-blue-600 font-medium hover:text-blue-700 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;