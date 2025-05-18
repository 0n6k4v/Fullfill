import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faChevronDown,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ user = {} }) => {
  const { avatar = '/images/default-avatar.jpg', name = 'Guest' } = user;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Fullfill Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <FontAwesomeIcon icon={faSearch} className="text-xl" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </button>
            <div className="flex items-center space-x-2">
              <img
                src={avatar}
                alt={name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;