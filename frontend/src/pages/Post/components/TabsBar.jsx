'use client';

import React, { useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faList, faSort, faChevronDown, faChevronUp, faGift, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

const TabsBar = ({ 
  activeTab = 'all', 
  setActiveTab = () => {}, 
  viewMode, 
  setViewMode,
  sortOptions,
  selectedSort,
  onSortChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const tabs = [
    { id: 'all', name: 'ทั้งหมด', icon: null },
    { id: 'Offer', name: 'การบริจาค', icon: faGift },
    { id: 'Request', name: 'คำขอรับบริจาค', icon: faHandHoldingHeart }
  ];

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortSelect = (option) => {
    onSortChange(option);
    setShowSortDropdown(false);
  };

  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-label={`แสดง${tab.name}`}
            >
              <div className="flex items-center">
                {tab.icon && (
                  <FontAwesomeIcon 
                    icon={tab.icon} 
                    className={`mr-2 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} 
                  />
                )}
                {tab.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 py-1 px-3 border border-gray-300 rounded-md"
              onClick={toggleSortDropdown}
            >
              <FontAwesomeIcon icon={faSort} className="mr-2" />
              {selectedSort}
              <FontAwesomeIcon
                icon={showSortDropdown ? faChevronUp : faChevronDown}
                className="ml-2"
              />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedSort === option
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSortSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? 'bg-blue-100 text-indigo-600'
                  : 'bg-white text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? 'bg-blue-100 text-indigo-600'
                  : 'bg-white text-gray-600'
              }`}
              aria-label="List view"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsBar;