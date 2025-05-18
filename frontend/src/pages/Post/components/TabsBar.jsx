'use client';

import React, { useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faList, faSort, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const TabsBar = ({ 
  activeTab, 
  setActiveTab, 
  viewMode, 
  setViewMode,
  sortOptions,
  selectedSort,
  onSortChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const tabs = ["All Posts", "Donation Posts", "Request Posts"];

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortSelect = (option) => {
    onSortChange(option);
    setShowSortDropdown(false);
  };

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200 flex justify-between items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

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