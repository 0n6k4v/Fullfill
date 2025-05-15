import React from 'react';
import QuickActions from './QuickActions';

const WelcomeSection = ({ user }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi {user.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome back to your donation dashboard</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm font-medium text-gray-500">Today is {formattedDate}</span>
          </div>
        </div>
        
        <QuickActions />
      </div>
    </div>
  );
};

export default WelcomeSection;