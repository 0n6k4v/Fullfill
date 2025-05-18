import React from 'react';

const TabsNavigation = ({ tabs = [], activeTab, setActiveTab }) => {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap !rounded-button cursor-pointer ${
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;