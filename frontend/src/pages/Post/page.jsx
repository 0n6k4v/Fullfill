'use client';

import React, { useState, useEffect } from "react";
import Header from './components/Header';
import TabsBar from './components/TabsBar';
import SearchAndFilters from './components/SearchAndFilters';
import PostFeed from './components/PostFeed';
import FloatingActionButton from "../../components/FloatingActionButton";
import Footer from "@/components/Footer";
import api from '@/services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';

const Post = () => {
  const [activeTab, setActiveTab] = useState("All Posts");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  // เพิ่ม state สำหรับ Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent");
  
  // สถานะสำหรับการเก็บข้อมูลจาก API
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sortOptions = ["Most Recent", "Near Me", "Most Urgent", "Category"];

  // ล้างตัวกรองทั้งหมด
  const clearFilters = () => {
    setCategoryFilter("all");
    setConditionFilter("all");
    setLocationFilter("");
    setSearchQuery("");
  };

  // ดึงข้อมูลจาก API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // กำหนดประเภทที่จะดึงข้อมูลตาม activeTab
      let params = {};
      
      if (activeTab === "Donation Posts") {
        params.type = "Offer";
      } else if (activeTab === "Request Posts") {
        params.type = "Request";
      }
      
      // เพิ่มการกรองจาก filter ที่ผู้ใช้เลือก
      if (categoryFilter !== "all") {
        params.category = categoryFilter;
      }
      
      if (conditionFilter !== "all") {
        params.condition = conditionFilter;
      }
      
      // ถ้ามีการค้นหา
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // ถ้ามีการกรองตามสถานที่ (ซึ่งอาจจะกรองบน client side เนื่องจาก API อาจไม่รองรับ)
      if (locationFilter) {
        params.location = locationFilter;
      }
      
      // เพิ่มการเรียงลำดับ
      if (sortOption === "Most Recent") {
        params.sort = "created_at:desc";
      } else if (sortOption === "Category") {
        params.sort = "category:asc";
      }
      
      // เรียก API
      const response = await api.get('/items/', { params });
      
      if (response.data) {
        // แปลงข้อมูลจาก API ให้เป็นรูปแบบที่เข้ากับ PostCard
        const transformedItems = response.data.map(item => ({
          id: item.id,
          type: item.type,
          title: item.name,
          name: item.name,
          category: item.category,
          condition: item.condition,
          description: item.description,
          location: item.location,
          image: item.image && item.image.length > 0 ? item.image[0].url : '/placeholder-image.jpg',
          created_at: item.created_at,
          updated_at: item.updated_at,
          uploaded_by: item.uploaded_by,
          status: item.status,
          lat: item.lat,
          lon: item.lon
        }));
        
        // กรองตาม location บน client ถ้า API ไม่รองรับ
        let filteredItems = transformedItems;
        if (locationFilter && !params.location) {
          filteredItems = transformedItems.filter(item => 
            item.location && item.location.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        
        setItems(filteredItems);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // เรียกข้อมูลเมื่อหน้า load หรือเมื่อตัวกรองเปลี่ยน
  useEffect(() => {
    fetchItems();
  }, [activeTab, searchQuery, categoryFilter, conditionFilter, locationFilter, sortOption]);

  // อัพเดทวิธีการจัดเรียงเมื่อถูกเลือกจาก TabsBar
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabsBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortOptions={sortOptions}
          selectedSort={sortOption}
          onSortChange={handleSortChange}
        />

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          clearFilters={clearFilters}
        />

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

        {/* Items Feed */}
        {!loading && !error && (
          items.length > 0 ? (
            <PostFeed posts={items} viewMode={viewMode} />
          ) : (
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
          )
        )}
      </main>

      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Post;