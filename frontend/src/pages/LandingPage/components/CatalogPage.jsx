"use client";

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faMapMarkerAlt, faSearch, faFilter, faChevronUp, faChevronDown,
  faHandshake, faHandHoldingHeart, faSpinner, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';

const CatalogPage = () => {
  // State for mode toggle (Request/Donation)
  const [mode, setMode] = useState('donation'); // 'donation' or 'request'

  // State for filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'map'
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // New states for API data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. เพิ่ม state สำหรับเก็บพิกัดของผู้ใช้
  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [loadingDistances, setLoadingDistances] = useState(false);
  
  // Predefined locations - ในอนาคตอาจดึงจาก API
  const locations = [
    "All Locations",
    "Downtown, Seattle",
    "Capitol Hill, Seattle",
    "Ballard, Seattle",
    "Fremont, Seattle",
    "Queen Anne, Seattle",
    "University District, Seattle",
  ];

  // Categories based on ER diagram enum definitions
  const categories = [
    { id: 'all', name: 'All Items', icon: faThLarge },
    { id: 'furniture', name: 'Furniture', icon: faCouch },
    { id: 'clothing', name: 'Clothing', icon: faTshirt },
    { id: 'electronics', name: 'Electronics', icon: faLaptop },
    { id: 'appliances', name: 'Appliances', icon: faBlender },
    { id: 'kids_toys', name: 'Kids & Toys', icon: faBaby },
    { id: 'books', name: 'Books', icon: faBook },
    { id: 'kitchen', name: 'Kitchen', icon: faUtensils },
    { id: 'other', name: 'Other', icon: faThLarge }
  ];

  // Condition enum definitions
  const conditions = [
    { id: 'all', name: 'All Conditions' },
    { id: 'new', name: 'New' },
    { id: 'like_new', name: 'Like New' },
    { id: 'good', name: 'Good' },
    { id: 'fair', name: 'Fair' },
    { id: 'poor', name: 'Poor' },
    { id: 'any', name: 'Any' }
  ];

  // Helper function to get the icon for a category
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId.toLowerCase());
    return category ? category.icon : faThLarge;
  };

  // Helper function to get condition colors
  const getConditionColors = (conditionId) => {
    const conditionId_lower = conditionId?.toLowerCase();
    switch (conditionId_lower) {
      case 'new':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
      case 'like_new':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'good':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'fair':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'poor':
        return { bg: 'bg-orange-100', text: 'text-orange-800' };
      case 'any':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // สร้าง query parameters สำหรับการกรองข้อมูล
      const params = {
        type: mode === 'donation' ? 'Offer' : 'Request'
      };
      
      // เพิ่มพารามิเตอร์การกรองเฉพาะเมื่อมีการเลือก
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      if (conditionFilter !== 'all') {
        params.condition = conditionFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // ถ้าต้องการกรองตามวันที่
      if (dateFilter !== 'any') {
        const now = new Date();
        let fromDate;
        
        if (dateFilter === 'today') {
          fromDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (dateFilter === 'week') {
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 7);
        } else if (dateFilter === 'month') {
          fromDate = new Date(now);
          fromDate.setMonth(fromDate.getMonth() - 1);
        }
        
        if (fromDate) {
          params.from_date = fromDate.toISOString();
        }
      }
      
      // เรียก API
      const response = await api.get('/items/', { params });
      
      // ตรวจสอบว่ามีข้อมูลและแปลงข้อมูลให้ตรงกับรูปแบบที่ต้องการ
      if (response.data) {
        // อาจจำเป็นต้องแปลงข้อมูลจาก API ให้ตรงกับโครงสร้างที่ใช้ใน UI
        const transformedItems = response.data.map(item => ({
          id: item.id,
          TYPE: item.type === 'Offer' ? 'donation' : 'request',
          name: item.name,
          category: item.category,
          Condition: item.condition,
          Description: item.description,
          Location: item.location,
          image: { url: item.image[0].url },
          created_at: item.created_at,
          updated_at: item.updated_at,
          uploaded_by: item.uploaded_by,
          Status: item.status === 'available' ? 1 : item.status === 'reserved' ? 2 : 3,
          Expire: item.expire || null,
          matched_userid: item.matched_userid,
          lat: item.lat,
          lon: item.lon
        }));
        
        setItems(transformedItems);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useEffect เพื่อเรียกข้อมูลเมื่อโหลดหน้าหรือเมื่อตัวกรองเปลี่ยน
  useEffect(() => {
    fetchItems();
  }, [mode, categoryFilter, conditionFilter, dateFilter, searchQuery]);

  // 2. เพิ่ม useEffect เพื่อรับตำแหน่งปัจจุบันของผู้ใช้
  useEffect(() => {
    // ขอตำแหน่งผู้ใช้ด้วย Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Filter and sort items in the frontend
  const filteredItems = items.filter(item => {
    // ถ้าใช้การกรองจาก API แล้ว ส่วนนี้อาจไม่จำเป็นต้องกรองอีก
    // หรืออาจเหลือไว้เพื่อกรองเพิ่มเติมสำหรับบางเงื่อนไข
    
    // Filter by location (เนื่องจากอาจไม่มีการกรองด้านนี้ใน API)
    if (locationFilter && !item.Location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Apply sorting based on selected option
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'az':
        return a.name.localeCompare(b.name);
      case 'za':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const toggleMode = () => {
    setMode(mode === 'donation' ? 'request' : 'donation');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setConditionFilter('all');
    setLocationFilter('');
    setDateFilter('any');
    setSearchQuery('');
  };

  // 3. เพิ่มฟังก์ชันสำหรับคำนวณระยะทางโดยใช้ Longdo Map API
  const calculateDistance = async (userLat, userLon, itemLat, itemLon, itemId) => {
    if (!userLat || !userLon || !itemLat || !itemLon) {
      return null;
    }
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
      const url = `https://api.longdo.com/RouteService/json/route/guide?flat=${userLat}&flon=${userLon}&tlat=${itemLat}&tlon=${itemLon}&mode=t&type=25&locale=th&key=${apiKey}`;
      
      const response = await fetch(url);
      const text = await response.text(); // รับข้อมูลเป็น text ก่อน
    
      try {
        // ลองแปลงเป็น JSON
        const data = JSON.parse(text);
        
        // ตรวจสอบว่ามีข้อมูลระยะทางหรือไม่ตามโครงสร้างใหม่
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].distance) {
          // แปลงระยะทางจากเมตรเป็นกิโลเมตร
          const distanceKm = (data.data[0].distance / 1000).toFixed(1);
          
          // เก็บระยะทางในสถานะ
          setDistances(prev => ({
            ...prev,
            [itemId]: `${distanceKm} กม.`
          }));
          
          return `${distanceKm} กม.`;
        } else {
          console.warn("No distance data found in response:", data);
          return "ไม่พบเส้นทาง";
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        console.log("Raw response:", text);
        return "ไม่สามารถคำนวณได้";
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      return "ไม่สามารถคำนวณได้";
    }
  };

  // 4. ปรับปรุงฟังก์ชัน getItemDistance
  const getItemDistance = (itemLocation, itemLat, itemLon, itemId) => {
    // ถ้ามีระยะทางที่คำนวณไว้แล้ว ให้ใช้ค่านั้น
    if (distances[itemId]) {
      return distances[itemId];
    }
    
    // ถ้ามีพิกัดของผู้ใช้และของสิ่งของ ให้คำนวณระยะทาง
    if (userLocation && itemLat && itemLon) {
      calculateDistance(
        userLocation.lat, 
        userLocation.lon, 
        itemLat, 
        itemLon, 
        itemId
      );
      return "กำลังคำนวณ..."; // แสดงขณะกำลังคำนวณ
    }
    
    // ถ้าไม่มีข้อมูลพิกัด ใช้ระยะทางจำลอง
    const distanceMap = {
      'กรุงเทพฯ': '5.2 กม.',
      'ปทุมธานี': '15.7 กม.',
      'นนทบุรี': '8.3 กม.',
      // เพิ่มเมืองอื่นๆ ตามต้องการ
    };
    
    return distanceMap[itemLocation] || "ไม่ทราบระยะทาง";
  };

  // 5. หลังจากโหลดข้อมูลจาก API สำเร็จ คำนวณระยะทางสำหรับทุกรายการ
  useEffect(() => {
    // ถ้ามีข้อมูลพิกัดของผู้ใช้และมีรายการสิ่งของ
    if (userLocation && items.length > 0 && !loadingDistances) {
      setLoadingDistances(true);
      
      // คำนวณระยะทางสำหรับทุกรายการที่มีพิกัด
      const calculateAllDistances = async () => {
        const distancePromises = items
          .filter(item => item.lat && item.lon)
          .map(item => 
            calculateDistance(
              userLocation.lat, 
              userLocation.lon, 
              item.lat, 
              item.lon, 
              item.id
            )
          );
        
        await Promise.all(distancePromises);
        setLoadingDistances(false);
      };
      
      calculateAllDistances();
    }
  }, [userLocation, items]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Toggle Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {mode === 'donation' ? 'Browse Items to Request' : 'Browse Requested Items'}
          </h2>

          {/* Toggle Switch */}
          <div className="flex items-center p-1 bg-gray-200 rounded-full w-64 h-12">
            <button
              onClick={toggleMode}
              className={`flex-1 h-10 rounded-full flex items-center justify-center transition-all ${
                mode === 'donation'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-300'
              }`}
            >
              Donation
            </button>
            <button
              onClick={toggleMode}
              className={`flex-1 h-10 rounded-full flex items-center justify-center transition-all ${
                mode === 'request'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-300'
              }`}
            >
              Request
            </button>
          </div>

          <p className="mt-4 text-gray-600 text-center max-w-lg">
            {mode === 'donation'
              ? 'Browse items that people are offering to donate. Click on an item to request it.'
              : 'Browse items that people are looking for. Offer your help by donating these items.'}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={toggleFilters}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-indigo-600"
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filters
              <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="ml-2" />
            </button>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-indigo-600' : 'bg-white text-gray-600'}`}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-indigo-600' : 'bg-white text-gray-600'}`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 ${viewMode === 'map' ? 'bg-blue-100 text-indigo-600' : 'bg-white text-gray-600'}`}
                aria-label="Map view"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-3">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-blue-800 flex items-center"
                >
                  Clear all
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

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-600 flex items-center">
                    <FontAwesomeIcon icon={faChevronDown} className="mr-2" /> Date Posted
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="any">Any time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Item Catalog */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Results info */}
        <div className="mb-4 flex justify-between items-center">
          {!loading && !error && (
            <p className="text-gray-600">{filteredItems.length} items found</p>
          )}
          <select
            className="block pl-3 pr-10 py-2 text-sm border-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A to Z</option>
            <option value="za">Z to A</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="text-indigo-500 text-4xl animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Loading items...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading items</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && !loading && !error && (
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-4 mb-6">
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
              <div className="text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Map View</h3>
                <p className="text-gray-600">Map integration will be available soon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {viewMode === 'grid' && !loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img src={item.image.url} alt={item.name} className="w-full h-48 object-contain" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.Location}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{getItemDistance(item.Location, item.lat, item.lon, item.id)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.Description}</p>
                  
                  {/* Tags and Button in separate rows for better alignment */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                        <FontAwesomeIcon icon={getCategoryIcon(item.category)} className="mr-1" size="sm" />
                        {item.category}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getConditionColors(item.Condition).bg} ${getConditionColors(item.Condition).text}`}>
                        {conditions.find(c => c.id === item.Condition?.toLowerCase())?.name || item.Condition}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white ${
                        mode === 'donation' 
                          ? 'bg-amber-500 hover:bg-amber-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } transition-colors whitespace-nowrap cursor-pointer`}>
                        <FontAwesomeIcon 
                          icon={mode === 'donation' ? faHandshake : faHandHoldingHeart} 
                          className="mr-1.5" 
                          size="sm"
                        />
                        {mode === 'donation' ? 'Request Item' : 'Offer Item'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* List View */}
        {viewMode === 'list' && !loading && !error && (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <img src={item.image.url} alt={item.name} className="w-full sm:w-48 h-48 object-cover" />
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FontAwesomeIcon icon={getCategoryIcon(item.category)} className="mr-1" />
                          {item.category}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColors(item.Condition).bg} ${getConditionColors(item.Condition).text}`}>
                          {conditions.find(c => c.id === item.Condition?.toLowerCase())?.name || item.Condition}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{item.Location}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{getItemDistance(item.Location, item.lat, item.lon, item.id)}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.Description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {item.Status === 1 ? 'Available' : item.Status === 2 ? 'Reserved' : 'Completed'}
                        {item.Expire && <span className="ml-2">• Expires: {new Date(item.Expire).toLocaleDateString()}</span>}
                      </div>
                      <button className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white ${
                        mode === 'donation' 
                          ? 'bg-amber-500 hover:bg-amber-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } transition-colors !rounded-button whitespace-nowrap cursor-pointer`}>
                        <FontAwesomeIcon 
                          icon={mode === 'donation' ? faHandshake : faHandHoldingHeart} 
                          className="mr-2" 
                        />
                        {mode === 'donation' ? 'Request Item' : 'Offer Item'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FontAwesomeIcon icon={faSearch} size="3x" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CatalogPage;