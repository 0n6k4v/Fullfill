import React from "react";
import Link from "next/link"; // เพิ่ม import สำหรับ Link
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="/"
            >
              <h1 className="text-2xl font-bold text-blue-600">
                <span className="text-indigo-500">Full</span>fill
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;