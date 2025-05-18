import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import QuickActions from './QuickActions';

const WelcomeSection = ({ user = {} }) => {
  const { name = 'Guest' } = user;
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">สวัสดี, {name}</h1>
          <p className="text-gray-600 mt-1">ยินดีต้อนรับกลับมาที่ Fullfill</p>
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </button>
      </div>
      
      <QuickActions />
    </div>
  );
};

export default WelcomeSection;