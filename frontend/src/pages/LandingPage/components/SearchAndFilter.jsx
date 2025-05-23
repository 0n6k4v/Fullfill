"use client"

import React, { useState, useEffect } from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, faCouch, faTshirt, faLaptop, faBlender, faBaby, 
  faBook, faUtensils, faMapMarkerAlt, faSearch, faFilter, faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';

const SearchAndFilter = ({
  searchQuery = '',
  setSearchQuery = () => {},
  categoryFilter = 'all',
  setCategoryFilter = () => {},
  conditionFilter = 'all',
  setConditionFilter = () => {},
  locationFilter = '',
  setLocationFilter = () => {},
  typeFilter = 'all',
  setTypeFilter = () => {},
  clearFilters = () => {},
  onSearch = () => {}
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState([{ id: "all", name: "ทุกพื้นที่" }]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const categories = [
    { id: 'all', name: 'ทุกหมวดหมู่' },
    { id: 'furniture', name: 'เฟอร์นิเจอร์' },
    { id: 'clothing', name: 'เสื้อผ้า' },
    { id: 'electronics', name: 'อิเล็กทรอนิกส์' },
    { id: 'appliances', name: 'เครื่องใช้ไฟฟ้า' },
    { id: 'kids_toys', name: 'ของเล่นเด็ก' },
    { id: 'books', name: 'หนังสือ' },
    { id: 'kitchen', name: 'ของใช้ในครัว' },
    { id: 'other', name: 'อื่นๆ' }
  ];

  const conditions = [
    { id: 'all', name: 'ทุกสภาพ' },
    { id: 'new', name: 'ใหม่' },
    { id: 'like_new', name: 'เหมือนใหม่' },
    { id: 'good', name: 'ดี' },
    { id: 'fair', name: 'พอใช้' },
    { id: 'poor', name: 'แย่' }
  ];

  const types = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'Offer', name: 'การบริจาค' },
    { id: 'Request', name: 'คำขอรับบริจาค' }
  ];

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleSearch = (e) => {
    if (!e) return;
    e.preventDefault();
    onSearch();
  };

  const handleSearchChange = (e) => {
    if (!e || !e.target) return;
    setSearchQuery(e.target.value);
  };

  const handleTypeChange = (e) => {
    if (!e || !e.target) return;
    setTypeFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    if (!e || !e.target) return;
    setCategoryFilter(e.target.value);
  };

  const handleConditionChange = (e) => {
    if (!e || !e.target) return;
    setConditionFilter(e.target.value);
  };

  const handleLocationChange = (e) => {
    if (!e || !e.target) return;
    setLocationFilter(e.target.value);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingLocations(true);
        const response = await api.get('/api/provinces/');
        const data = response.data;
        console.log(response.data);
         
        
        setLocations([
          { id: "all", name: "ทุกพื้นที่" },
          ...data.map(province => ({
            id: province.id.toString(),
            name: province.province_name
          }))
        ]);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchProvinces();
  }, []);

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
              placeholder="ค้นหารายการ..."
              value={searchQuery || ''}
              onChange={handleSearchChange}
            />
          </div>
          <button
            type="button"
            onClick={toggleFilters}
            className="flex justify-center items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-indigo-600"
            aria-label="แสดงตัวกรอง"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            ตัวกรอง
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-2" />
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            aria-label="ค้นหา"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {showFilters && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium text-gray-900">กรองผลลัพธ์</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
              aria-label="ล้างตัวกรองทั้งหมด"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faThLarge} className="mr-2" /> ประเภทรายการ
              </label>
              <select
                value={typeFilter || 'all'}
                onChange={handleTypeChange}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="เลือกประเภทรายการ"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-600 flex items-center">
                <FontAwesomeIcon icon={faThLarge} className="mr-2" /> หมวดหมู่
              </label>
              <select
                value={categoryFilter || 'all'}
                onChange={handleCategoryChange}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="เลือกหมวดหมู่"
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
                <FontAwesomeIcon icon={faFilter} className="mr-2" /> สภาพ
              </label>
              <select
                value={conditionFilter || 'all'}
                onChange={handleConditionChange}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="เลือกสภาพ"
              >
                {conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {condition.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                พื้นที่
              </label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {loadingLocations ? (
                    <option>กำลังโหลดข้อมูล...</option>
                  ) : (
                    locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;