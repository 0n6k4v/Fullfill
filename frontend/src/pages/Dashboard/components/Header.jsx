'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
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
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <span className="text-indigo-500">Full</span>fill
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Home
          </Link>
          <Link href="/Post" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Post
          </Link>
          <Link href="/Map" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
            Map
          </Link>
          <Link href="/Dashboard" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
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
                  <Link href="/User/MyProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> My Profile
                  </Link>
                  <Link href="/User/MyPost" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faGift} className="mr-2" /> My Post
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link href="/Logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                  </Link>
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