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
import DonationCard from '@/components/PostCard';
import SearchAndFilter from './SearchAndFilter';

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
      const response = await api.get('api/v1/items/', { params });
      
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แคตตาล็อกสิ่งของ</h1>
          <p className="mt-2 text-gray-600">
            ค้นหาสิ่งของที่คุณต้องการหรือต้องการบริจาค
          </p>
        </div>

        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          clearFilters={clearFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <DonationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;