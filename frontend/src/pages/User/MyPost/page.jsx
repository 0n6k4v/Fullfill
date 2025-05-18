'use client';

import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/Header';
import Header from './components/Header';
import DonationStats from './components/DonationStats';
import DonationFilters from './components/DonationFilters';
import DonationTabs from './components/DonationTabs';
import DonationList from './components/DonationList';
import Pagination from './components/Pagination';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

const MyDonation = () => {
  // States...
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // สร้าง state ใหม่สำหรับเก็บข้อมูลทั้งหมด
  const [allDonations, setAllDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({
    total: 0,
    available: 0,
    matched: 0,
    fulfilled: 0,
    recipients: 0
  });

  // Categories...
  const categories = [
    { label: 'Furniture', value: 'furniture' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Toys', value: 'toys' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Sports', value: 'sports' },
  ];

  // Fetch user profile...
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch ALL posts data (ดึงข้อมูลทั้งหมดเพียงครั้งเดียว)
  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      
      try {
        // เรียกข้อมูลทั้งหมดโดยไม่ใส่ status parameter
        const response = await api.get('/users/me/posts');
        console.log("All posts API response:", response.data);
        
        // เก็บข้อมูลทั้งหมด
        const items = response.data.items || response.data || [];
        setAllDonations(items);
        
        // คำนวณสถิติจากข้อมูลที่ได้
        const total = items.length;
        const available = items.filter(item => item.status === 'available').length;
        const matched = items.filter(item => item.status === 'matched').length;
        const fulfilled = items.filter(item => item.status === 'fulfilled').length;
        
        // อัพเดทสถิติ
        setDonationStats({
          total,
          available,
          matched,
          fulfilled,
          recipients: matched + fulfilled // ตัวอย่างการคำนวณ
        });
        
        // กรองตาม activeTab เริ่มต้น
        filterDonationsByTab(items, activeTab);
        
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching all posts:", err);
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []); // เรียกเพียงครั้งเดียวตอนโหลดหน้า

  // ฟังก์ชันกรองข้อมูลตาม tab
  const filterDonationsByTab = (donations, tab) => {
    console.log(`Filtering donations by tab: ${tab}`);
    
    if (!donations.length) return;
    
    let filtered = donations;
    
    // กรองตามแท็บ
    if (tab !== 'all') {
      filtered = donations.filter(donation => donation.status === tab);
    }
    
    // กรองเพิ่มเติมตาม category ถ้ามีการเลือก
    if (selectedCategory) {
      filtered = filtered.filter(donation => donation.category === selectedCategory);
    }
    
    // เรียงลำดับข้อมูล
    sortDonations(filtered);
    
    // อัพเดทข้อมูลที่แสดง
    setFilteredDonations(filtered);
    
    // คำนวณจำนวนหน้า
    setTotalPages(Math.ceil(filtered.length / pageSize));
    // กลับไปหน้าแรกเมื่อเปลี่ยนแท็บ
    setCurrentPage(1);
  };

  // ฟังก์ชันเรียงลำดับข้อมูล
  const sortDonations = (items) => {
    if (selectedSort === 'newest') {
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort === 'oldest') {
      items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    // เพิ่มเงื่อนไขการเรียงลำดับอื่นๆ ตามต้องการ
  };

  // ตัวจัดการการเปลี่ยนแท็บ
  const handleTabChange = (newTab) => {
    console.log("Tab changed to:", newTab);
    
    // ล้างการค้นหา
    setSearchQuery('');
    
    // เปลี่ยนแท็บที่ active
    setActiveTab(newTab);
    
    // กรองข้อมูลใหม่ตามแท็บที่เลือก
    filterDonationsByTab(allDonations, newTab);
    
    // แสดงสถานะ loading ระหว่างกรองข้อมูล
    setLoading(true);
    
    // จำลองเวลาโหลด
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // จัดการการเปลี่ยนแปลง category
  useEffect(() => {
    filterDonationsByTab(allDonations, activeTab);
  }, [selectedCategory]);

  // จัดการการเปลี่ยนแปลงการเรียงลำดับ
  useEffect(() => {
    const sorted = [...filteredDonations];
    sortDonations(sorted);
    setFilteredDonations(sorted);
  }, [selectedSort]);

  // จัดการการค้นหา
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // ถ้าไม่มีคำค้นหา ให้กรองตามแท็บปัจจุบัน
      filterDonationsByTab(allDonations, activeTab);
      return;
    }
    
    // กรองตามคำค้นหา
    const query = searchQuery.toLowerCase();
    const filtered = allDonations.filter(donation => {
      // กรองตามแท็บก่อน
      const matchesTab = activeTab === 'all' || donation.status === activeTab;
      // แล้วกรองตามคำค้นหา
      const matchesSearch = donation.title?.toLowerCase().includes(query) || 
                           donation.description?.toLowerCase().includes(query);
      
      return matchesTab && matchesSearch;
    });
    
    setFilteredDonations(filtered);
    setCurrentPage(1);
  }, [searchQuery, allDonations, activeTab]);

  // จัดการการเปลี่ยนหน้า
  const getPaginatedDonations = () => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return filteredDonations.slice(startIdx, endIdx);
  };

  // Handler for adding new donation...
  const handleAddNew = () => {
    window.location.href = '/item/create';
  };

  // Handler for editing a donation...
  const handleEdit = (id) => {
    window.location.href = `/item/edit/${id}`;
  };

  // Handler for deleting a donation
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await api.delete(`/items/${id}`);
      
      // อัพเดทข้อมูลทั้งหมด
      const updatedAll = allDonations.filter(donation => donation.id !== id);
      setAllDonations(updatedAll);
      
      // อัพเดทข้อมูลที่กรองแล้ว
      const updatedFiltered = filteredDonations.filter(donation => donation.id !== id);
      setFilteredDonations(updatedFiltered);
      
      // อัพเดทสถิติ
      const total = updatedAll.length;
      const available = updatedAll.filter(item => item.status === 'available').length;
      const matched = updatedAll.filter(item => item.status === 'matched').length;
      const fulfilled = updatedAll.filter(item => item.status === 'fulfilled').length;
      
      setDonationStats({
        total,
        available,
        matched,
        fulfilled,
        recipients: matched + fulfilled
      });
      
      toast.success('Item deleted successfully');
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error('Failed to delete item');
    }
  };

  // Handler for marking a donation as complete
  const handleMarkAsComplete = async (id) => {
    if (!confirm('Are you sure you want to mark this item as fulfilled?')) {
      return;
    }
    
    try {
      await api.patch(`/users/me/posts/${id}/status`, { status: 'fulfilled' });
      
      // อัพเดทข้อมูลทั้งหมด
      const updatedAll = allDonations.map(donation => {
        if (donation.id === id) {
          return { ...donation, status: 'fulfilled' };
        }
        return donation;
      });
      
      setAllDonations(updatedAll);
      
      // กรองข้อมูลใหม่
      filterDonationsByTab(updatedAll, activeTab);
      
      // อัพเดทสถิติ
      const total = updatedAll.length;
      const available = updatedAll.filter(item => item.status === 'available').length;
      const matched = updatedAll.filter(item => item.status === 'matched').length;
      const fulfilled = updatedAll.filter(item => item.status === 'fulfilled').length;
      
      setDonationStats({
        total,
        available,
        matched,
        fulfilled,
        recipients: matched + fulfilled
      });
      
      toast.success('Item marked as fulfilled');
    } catch (err) {
      console.error("Error updating item status:", err);
      toast.error('Failed to update item status');
    }
  };

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      {/* Header */}
      <ProfileHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header/>
        {/* Stats */}
        <DonationStats stats={donationStats} />
        
        {/* Filters */}
        <DonationFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          categories={categories}
        />
        
        {/* Tabs */}
        <DonationTabs 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          donationCounts={{
            all: donationStats.total,
            available: donationStats.available,
            matched: donationStats.matched,
            fulfilled: donationStats.fulfilled
          }}
        />
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading items...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading your posts</h3>
            <p className="mt-1 text-gray-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Donation List - แสดงเฉพาะข้อมูลในหน้าปัจจุบัน */}
            <DonationList 
              donations={getPaginatedDonations()}
              activeTab={activeTab}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkAsComplete={handleMarkAsComplete}
              onAddNew={handleAddNew}
            />
            
            {/* Pagination */}
            {filteredDonations.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyDonation;