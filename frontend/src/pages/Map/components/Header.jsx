'use client';

import React, { useState, useEffect, useRef } from "react";
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
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  
  // จัดการการคลิกนอกเมนู dropdown เพื่อปิดเมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    // เพิ่ม event listener เมื่อเมนูเปิด
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // สลับสถานะเมนู dropdown
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </h1>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Post
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Maps
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Dashboard
          </a>
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
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> My Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faGift} className="mr-2" /> My Donations
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" /> My Requests
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;