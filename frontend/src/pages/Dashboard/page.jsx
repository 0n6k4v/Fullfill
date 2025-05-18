'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';
import ViewModeToggle from './components/ViewModeToggle';
import SearchFilters from './components/SearchFilters';
import SummaryCards from './components/SummaryCards';
import DashboardCharts from './components/DashboardCharts';
import CategoryTable from './components/CategoryTable';
import FloatingActionButton from '../../components/FloatingActionButton';
import Footer from '@/components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import CategoryFulfillmentChart from './components/CategoryFulfillmentChart';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [neededItemsData, setNeededItemsData] = useState(null);

  const tabs = ["Dashboard"];
  const sortOptions = ["Most Recent", "Near Me", "Most Urgent", "Category"];
  const filterOptions = ["All", "Donations", "Requests"];

  // ลบข้อมูล mock ทั้งหมด (donationPosts, requestPosts)
  
  // Handle request click
  const handleRequestClick = (postId) => {
    console.log("Request clicked for post:", postId);
  };

  // Handle new post
  const handleNewPost = () => {
    console.log("Create new post");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, chartsRes, neededItemsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/charts'),
          api.get('/dashboard/needed-items')
        ]);

        const summary = summaryRes.data;
        const charts = chartsRes.data;
        const neededItems = neededItemsRes.data;

        setSummaryData(summary);
        setChartsData(charts);
        setNeededItemsData(neededItems);

      } catch (err) {
        setError(err.message);
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "Dashboard") {
      fetchData();
    }
  }, [activeTab]);

  if (loading && activeTab === "Dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} className="text-indigo-500 text-4xl animate-spin" />
          <span className="ml-3 text-lg">Loading Dashboard Data...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && activeTab === "Dashboard") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-red-500 text-xl">Error loading dashboard: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue="Most Recent"
              >
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
            
            {activeTab === "List View" && (
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        
        {/* Dashboard View */}
        {activeTab === "Dashboard" && summaryData && chartsData && neededItemsData && (
          <div className="space-y-6">
            <SummaryCards analyticsData={summaryData} />
            
            {/* แสดงเฉพาะกราฟแนวโน้ม */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request & Donation Trends</h3>
              <div className="h-80">
                {chartsData.requestTrends || chartsData.donationTrends ? (
                  <DashboardCharts chartData={chartsData} showOnlyTrends={true} />
                ) : <p>No trend data available.</p>}
              </div>
            </div>
            
            {/* เพิ่มกราฟเปรียบเทียบความต้องการของแต่ละประเภทและการตอบสนอง */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">การเปรียบเทียบความต้องการและการตอบสนองตามประเภท</h3>
              <div className="h-80">
                <CategoryFulfillmentChart categoryData={neededItemsData} />
              </div>
            </div>
            
            <CategoryTable categoryData={neededItemsData} />
          </div>
        )}
      </main>
      
      <FloatingActionButton onClick={handleNewPost} />
      <Footer />
    </div>
  );
};

export default Dashboard;