'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronUp, faChevronDown, faMapMarkerAlt, faThLarge } from '@fortawesome/free-solid-svg-icons';

const SearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  conditionFilter, 
  setConditionFilter, 
  locationFilter, 
  setLocationFilter, 
  clearFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // สำหรับจำลอง dropdown options
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'appliances', name: 'Appliances' },
    { id: 'kids_toys', name: 'Kids & Toys' },
    { id: 'books', name: 'Books' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'other', name: 'Other' }
  ];

  const conditions = [
    { id: 'all', name: 'All Conditions' },
    { id: 'new', name: 'New' },
    { id: 'like_new', name: 'Like New' },
    { id: 'good', name: 'Good' },
    { id: 'fair', name: 'Fair' },
    { id: 'poor', name: 'Poor' }
  ];

  const locations = [
    "All Locations",
    "กรุงเทพฯ",
    "ปทุมธานี",
    "นนทบุรี",
    "สมุทรปราการ",
    "อยุธยา"
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // ส่งคำค้นหาไปยังหน้าหลัก (e.g., page.jsx)
    // setSearchQuery จะทำงานแล้ว เนื่องจากรับมาจาก prop
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
      <div className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={toggleFilters}
            className="flex justify-center items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-indigo-600"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-2" />
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
        </form>
      </div>

      {showFilters && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filter Results</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faThLarge} className="mr-2" /> Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faFilter} className="mr-2" /> Condition
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {condition.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {locations.map(location => (
                  <option key={location} value={location === "All Locations" ? "" : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;