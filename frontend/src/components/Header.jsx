import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const Header = () => {
  return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Organizations
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Success Stories
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              About Us
            </a>
          </div>
          <div className="flex items-center space-x-4">

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;