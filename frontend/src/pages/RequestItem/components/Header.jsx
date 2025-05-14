import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a
              href="https://readdy.ai/home/254c1a80-280f-45a0-bdf5-cedf43376478/fc5cef19-b8a0-4528-9b6a-f3c7d4601e45"
              data-readdy="true"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </h1>
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