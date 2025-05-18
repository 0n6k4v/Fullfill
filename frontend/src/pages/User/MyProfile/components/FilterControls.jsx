import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const FilterControls = ({ 
  selectedDateRange = '7days', 
  setSelectedDateRange = () => {}, 
  selectedCategory = 'all', 
  setSelectedCategory = () => {} 
}) => {
  const handleDateRangeChange = (e) => {
    if (typeof setSelectedDateRange === 'function') {
      setSelectedDateRange(e.target.value);
    }
  };

  const handleCategoryChange = (e) => {
    if (typeof setSelectedCategory === 'function') {
      setSelectedCategory(e.target.value);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        <select
          value={selectedDateRange}
          onChange={handleDateRangeChange}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="7days">7 วันที่ผ่านมา</option>
          <option value="30days">30 วันที่ผ่านมา</option>
          <option value="3months">3 เดือนที่ผ่านมา</option>
          <option value="year">1 ปีที่ผ่านมา</option>
        </select>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">ทุกหมวดหมู่</option>
          <option value="clothing">เสื้อผ้า</option>
          <option value="food">อาหาร</option>
          <option value="medical">เวชภัณฑ์</option>
          <option value="education">การศึกษา</option>
        </select>
      </div>
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        ส่งออกรายงาน
      </button>
    </div>
  );
};

export default FilterControls;