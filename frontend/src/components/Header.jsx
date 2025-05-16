import React from "react";
import Link from "next/link";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const Header = () => {
  return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <Link
              href="/how-it-works"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              How It Works
            </Link>
            <Link
              href="/organizations"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Organizations
            </Link>
            <Link
              href="/success-stories"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Success Stories
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              About Us
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/Auth" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
              Sign In
            </Link>
          </div>
        </div>
      </header>
  );
};

export default Header;