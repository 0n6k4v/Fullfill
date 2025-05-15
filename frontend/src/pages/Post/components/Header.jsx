import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
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
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Post
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Maps
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </a>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
              <FontAwesomeIcon icon={faBell} />
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none">
              <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;