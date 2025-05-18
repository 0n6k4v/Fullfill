import React from 'react';

const FilterControls = ({ 
  selectedDateRange, 
  setSelectedDateRange, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="3months">Last 3 months</option>
          <option value="year">Last year</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="food">Food</option>
          <option value="medical">Medical</option>
          <option value="education">Education</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;