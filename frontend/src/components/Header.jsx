'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faUserCircle, 
  faUser, 
  faGift, 
  faHandHoldingHeart, 
  faEnvelope, 
  faCog, 
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const GlobalHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const pathname = usePathname(); // ใช้ usePathname แทน useRouter
  
  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // จัดการการคลิกนอกเมนู dropdown เพื่อปิดเมนู
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // สลับสถานะเมนู dropdown
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  // สลับสถานะเมนูบนมือถือ
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsProfileMenuOpen(false);
    // แทนที่ router.push('/') ด้วยการใช้ window.location
    window.location.href = '/';
  };

  // ตรวจสอบว่าเราอยู่ในสภาพแวดล้อมของเบราว์เซอร์หรือไม่
  const isBrowser = typeof window !== 'undefined';

  // ป้องกันการใช้ localStorage ในฝั่ง server
  useEffect(() => {
    if (isBrowser) {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
  }, [isBrowser]);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-blue-600">
            <span className="text-indigo-500">Ful</span>fill
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <button className="p-1 mr-3 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none">
              <FontAwesomeIcon icon={faBell} />
            </button>
          )}
          <button 
            onClick={toggleMobileMenu}
            className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* คงเนื้อหาที่เหลือเหมือนเดิม */}
          {isAuthenticated ? (
            // Logged in menu
            <>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                Home
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                Post
              </Link>
              <Link href="/maps" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                Maps
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none">
                  <FontAwesomeIcon icon={faBell} />
                </button>
                <div className="relative" ref={profileRef}>
                  <button 
                    className="p-1 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none"
                    onClick={toggleProfileMenu}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white z-50"
                      style={{ top: "100%" }}
                    >
                      <Link
                        href="/user/my-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> My Profile
                      </Link>
                      <Link
                        href="/user/my-donations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faGift} className="mr-2" /> My Donations
                      </Link>
                      <Link
                        href="/user/my-requests"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" /> My Requests
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Not logged in menu
            <>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                How It Works
              </Link>
              <Link
                href="/organizations"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Organizations
              </Link>
              <Link
                href="/success-stories"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Success Stories
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                About Us
              </Link>
              <Link href="/Auth" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 space-y-3 pb-3">
            {/* คงเนื้อหาที่เหลือเหมือนเดิม */}
            {isAuthenticated ? (
              // Logged in mobile menu
              <>
                <Link 
                  href="/"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {/* เมนูอื่นๆ ที่เหลือ */}
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
                {/* เมนูอื่นๆ ที่เหลือ */}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;