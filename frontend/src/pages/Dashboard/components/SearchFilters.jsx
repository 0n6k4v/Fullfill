import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faSlidersH, faFilter } from '@fortawesome/free-solid-svg-icons';

const SearchFilters = ({ 
  searchQuery = '', 
  setSearchQuery = () => {}, 
  filterOptions = [], 
  activeFilter = 'all', 
  setActiveFilter = () => {}, 
  filters = [] 
}) => {
  if (!filters || !Array.isArray(filters) || filters.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-500">ไม่พบตัวกรอง</p>
      </div>
    );
  }

  if (!filterOptions || !Array.isArray(filterOptions) || filterOptions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-500">ไม่พบตัวเลือกการกรอง</p>
      </div>
    );
  }

  const handleSearchChange = (e) => {
    if (!e || !e.target) return;
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    if (!filter) return;
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <div className="flex-grow relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="ค้นหาการบริจาคหรือคำขอ..."
          value={searchQuery || ''}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex space-x-2">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {filterOptions.map((filter) => (
            <button
              key={filter || 'unknown'}
              className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap !rounded-button cursor-pointer ${
                activeFilter === filter
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => handleFilterChange(filter)}
            >
              {filter || 'Unknown'}
            </button>
          ))}
        </div>
        <div className="relative">
          <button className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer !rounded-button whitespace-nowrap">
            <span>ระยะทาง: 10 กิโลเมตร</span>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs text-gray-500" />
          </button>
        </div>
        <button className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 !rounded-button whitespace-nowrap cursor-pointer">
          <FontAwesomeIcon icon={faSlidersH} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;