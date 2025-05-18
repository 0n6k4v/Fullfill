import React from 'react';

const TabsNavigation = ({ 
  tabs = ['ทั้งหมด', 'บริจาค', 'ขอรับ'], 
  activeTab = 'ทั้งหมด', 
  setActiveTab = () => {} 
}) => {
  // Ensure tabs is an array
  const safeTabs = Array.isArray(tabs) ? tabs : ['ทั้งหมด', 'บริจาค', 'ขอรับ'];
  
  // Map tab names to Thai
  const tabNames = {
    'all': 'ทั้งหมด',
    'donate': 'บริจาค',
    'request': 'ขอรับ',
    'ทั้งหมด': 'ทั้งหมด',
    'บริจาค': 'บริจาค',
    'ขอรับ': 'ขอรับ'
  };

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {safeTabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap !rounded-button cursor-pointer ${
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tabNames[tab] || tab}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;