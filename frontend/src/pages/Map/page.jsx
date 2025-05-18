'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // เพิ่มบรรทัดนี้
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';
import SearchFilters from './components/SearchFilters';
import FloatingActionButton from '../../components/FloatingActionButton';
import Footer from '@/components/Footer';
import api from '@/services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// โหลด MapView แบบ dynamic เพื่อหลีกเลี่ยงการ render บน server
const MapView = dynamic(
  () => import('./components/MapView'),
  { 
    ssr: false, 
    loading: () => (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} className="text-indigo-500 text-4xl animate-spin" />
        <span className="ml-3 text-lg text-gray-600">กำลังโหลดแผนที่...</span>
      </div>
    )
  }
);

const Map = () => {
  // States
  const [activeTab, setActiveTab] = useState("Map View");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOption, setSortOption] = useState("Most Recent");
  
  // Data states
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState({});

  // Constants
  const tabs = ["Map View"];
  const sortOptions = ["Most Recent", "Near Me", "Most Urgent", "Category"];

  // ดึงข้อมูลจาก API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let params = {};
      
      // ตัวกรองประเภท (Offer หรือ Request)
      if (typeFilter !== "all") {
        params.type = typeFilter;
      }
      
      // ตัวกรองหมวดหมู่
      if (categoryFilter !== "all") {
        params.category = categoryFilter;
      }
      
      // ตัวกรองสภาพ
      if (conditionFilter !== "all") {
        params.condition = conditionFilter;
      }
      
      // คำค้นหา
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // ตัวกรองสถานที่ (อาจต้องกรองบน client side)
      if (locationFilter) {
        params.location = locationFilter;
      }
      
      // เรียงลำดับ
      if (sortOption === "Most Recent") {
        params.sort = "created_at:desc";
      } else if (sortOption === "Category") {
        params.sort = "category:asc";
      }
      
      // เรียก API
      const response = await api.get('/items/', { params });
      
      if (response.data) {
        // แปลงข้อมูล
        const transformedItems = response.data.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          title: item.name,
          description: item.description,
          category: item.category,
          condition: item.condition,
          location: item.location,
          image: item.image && item.image.length > 0 ? item.image[0].url : '/placeholder-image.jpg',
          created_at: item.created_at,
          updated_at: item.updated_at,
          uploaded_by: item.uploaded_by,
          status: item.status,
          lat: item.lat,
          lon: item.lon
        }));
        
        setItems(transformedItems);
        
        // กรองข้อมูลตามการค้นหา/ตัวกรอง
        let filtered = transformedItems;
        
        // กรองตาม location บน client side ถ้าจำเป็น
        if (locationFilter && !params.location) {
          filtered = filtered.filter(item => 
            item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        
        setFilteredItems(filtered);
        
        // สร้างข้อมูลหมวดหมู่
        const categories = {};
        transformedItems.forEach(item => {
          if (item.category) {
            if (!categories[item.category]) {
              categories[item.category] = 0;
            }
            categories[item.category]++;
          }
        });
        setCategoryData(categories);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // เรียกข้อมูลเมื่อโหลดครั้งแรก
  useEffect(() => {
    fetchItems();
  }, []);

  // เรียกข้อมูลเมื่อมีการเปลี่ยนตัวกรอง
  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter, conditionFilter, locationFilter, sortOption]);

  // ล้างตัวกรองทั้งหมด
  const clearFilters = () => {
    setCategoryFilter("all");
    setConditionFilter("all");
    setLocationFilter("");
    setTypeFilter("all");
    setSearchQuery("");
  };

  // ค้นหาด้วยปุ่ม
  const handleSearch = () => {
    fetchItems();
  };

  // คำนวณข้อมูลสถิติจากข้อมูลที่มีอยู่แล้ว
  const calculateStats = () => {
    if (!items.length) return null;
    
    return {
      totalRequests: items.filter(item => item.type === "Request").length,
      totalDonations: items.filter(item => item.type === "Offer").length,
      fulfilledRequests: items.filter(item => item.status === "completed").length,
      activeUsers: new Set(items.map(item => item.uploaded_by).filter(Boolean)).size,
      requestGrowth: 12.5, // ตัวเลขตัวอย่าง
      donationGrowth: 8.2,  // ตัวเลขตัวอย่าง
      fulfillmentGrowth: 15.3, // ตัวเลขตัวอย่าง
      userGrowth: 24.5, // ตัวเลขตัวอย่าง
    };
  };

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">เรียงตาม:</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          clearFilters={clearFilters}
          onSearch={handleSearch}
        />

        {/* Map View */}
        <MapView 
          items={filteredItems} 
          loading={loading} 
          error={error} 
        />
      </main>
      
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Map;