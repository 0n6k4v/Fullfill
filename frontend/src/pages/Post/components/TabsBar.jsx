import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faThLarge, faList } from '@fortawesome/free-solid-svg-icons';

const TabsBar = ({ activeTab, setActiveTab, viewMode, setViewMode, sortOptions }) => {
  const tabs = ["All Posts", "Donation Posts", "Request Posts", "My Following"];
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap !rounded-button ${
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

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue="Most Recent"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </div>
        </div>

        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setViewMode("grid")}
          >
            <FontAwesomeIcon icon={faThLarge} className="text-gray-500" />
          </button>
          <button
            className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setViewMode("list")}
          >
            <FontAwesomeIcon icon={faList} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabsBar;