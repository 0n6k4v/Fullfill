'use client';

import React, { useState } from "react";
import Header from '@/components/Header';
import UserProfileCard from './components/UserProfileCard';
import FilterControls from './components/FilterControls';
import ActivitySummaryCards from './components/ActivitySummaryCards';
import UserActivityChart from './components/UserActivityChart';
import RecentActivity from './components/RecentActivity';
import PostsSection from "./components/PostsSection";
import MatchesSection from "./components/MatchesSection";
import Footer from "@/components/Footer";

const MyProfile = () => {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("7days");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // User profile data
  const userProfile = {
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Individual Donor",
    joinedDate: "2024-01-15",
    totalDonations: 12,
    totalRequests: 5,
    completedTransactions: 8,
    rating: 4.8,
    verificationStatus: "Verified",
  };

  // Analytics data
  const analyticsData = {
    myDonations: 12,
    myRequests: 5,
    pendingOffers: 3,
    savedItems: 15,
    totalRequests: 1284,
    totalDonations: 956,
    fulfilledRequests: 742,
    activeUsers: 2847,
    requestGrowth: 12.5,
    donationGrowth: 8.2,
    fulfillmentGrowth: 15.3,
    userGrowth: 24.5,
  };

  // Category data
  const categoryData = {
    clothing: { requests: 245, donations: 156, shortage: 89, rate: 64 },
    schoolSupplies: { requests: 189, donations: 142, shortage: 47, rate: 75 },
    foodItems: { requests: 312, donations: 278, shortage: 34, rate: 89 },
    medicalSupplies: { requests: 156, donations: 98, shortage: 58, rate: 63 },
    furniture: { requests: 134, donations: 112, shortage: 22, rate: 84 },
    electronics: { requests: 248, donations: 172, shortage: 76, rate: 69 },
  };

  // User activity data
  const userActivityData = {
    recentDonations: [
      {
        id: 1,
        title: "Children's Books",
        status: "Completed",
        date: "2025-05-10",
        recipient: "Local Library",
      },
      {
        id: 2,
        title: "Winter Coats",
        status: "In Progress",
        date: "2025-05-08",
        recipient: "Community Center",
      },
    ],
    recentRequests: [
      {
        id: 3,
        title: "School Supplies",
        status: "Pending",
        date: "2025-05-12",
        donor: "Pending",
      },
    ],
    savedSearches: [
      {
        id: 1,
        query: "Children's Books",
        category: "Education",
        location: "San Francisco",
      },
      {
        id: 2,
        query: "Winter Clothing",
        category: "Clothing",
        location: "Bay Area",
      },
    ],
  };

  // Posts data
  const posts = {
    active: [
      {
        id: 1,
        title: "Office Desk Chair",
        category: "Furniture",
        location: "Seattle, CA",
        postedDate: "2 days ago",
        image: "https://readdy.ai/api/search-image?query=modern%20black%20office%20chair%20with%20ergonomic%20design%2C%20comfortable%20seating%20with%20adjustable%20height%2C%20professional%20photography%20on%20white%20background%2C%20detailed%20texture%2C%20high%20resolution%20product%20image&width=100&height=80&seq=chair1&orientation=portrait",
      },
      {
        id: 2,
        title: "Microwave Oven",
        category: "Appliances",
        location: "Seattle, CA",
        postedDate: "3 days ago",
        image: "https://readdy.ai/api/search-image?query=modern%20stainless%20steel%20microwave%20oven%20on%20clean%20white%20background%2C%20kitchen%20appliance%20with%20digital%20display%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20buttons%20and%20features&width=100&height=80&seq=microwave1&orientation=landscape",
      },
    ],
    matched: [
      {
        id: 3,
        title: "Children's Bicycle",
        category: "Toys & Sports",
        location: "Seattle, CA",
        postedDate: "5 days ago",
        matchedWith: "Sarah Wilson",
        matchDate: "May 12, 2025",
        image: "https://readdy.ai/api/search-image?query=colorful%20children%20bicycle%20with%20training%20wheels%20on%20clean%20white%20background%2C%20blue%20and%20red%20kids%20bike%20for%20beginners%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20features&width=100&height=80&seq=bike1&orientation=landscape",
      },
    ],
    completed: [
      {
        id: 4,
        title: "Winter Coat",
        category: "Clothing",
        location: "Seattle, CA",
        postedDate: "10 days ago",
        completedDate: "May 10, 2025",
        receivedBy: "Michael Brown",
        image: "https://readdy.ai/api/search-image?query=navy%20blue%20winter%20coat%20with%20hood%20and%20fur%20trim%20on%20clean%20white%20background%2C%20warm%20padded%20jacket%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20texture%20and%20zipper%20features&width=100&height=80&seq=coat1&orientation=portrait",
      },
    ],
  };

  // Matches data
  const matches = [
    {
      id: 1,
      type: "incoming",
      user: "Emily Parker",
      userAvatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20friendly%20smile%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar2&orientation=squarish",
      item: "Bookshelf",
      date: "May 14, 2025",
      status: "Pending",
    },
    {
      id: 2,
      type: "outgoing",
      user: "David Miller",
      userAvatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar3&orientation=squarish",
      item: "Baby Stroller",
      date: "May 13, 2025",
      status: "Accepted",
    },
  ];

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      {/* Header */}
      <Header 
        userProfile={userProfile} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Summary */}
        <UserProfileCard userProfile={userProfile} />
        
        {/* Filters */}
        <FilterControls
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Activity Summary Cards */}
        <ActivitySummaryCards analyticsData={analyticsData} />

        {/* Recent Activity and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UserActivityChart />
          <RecentActivity userActivityData={userActivityData} />
        </div>

        <PostsSection posts={posts} />

        <MatchesSection matches={matches} />

      </main>
      
      <Footer />
    </div>
  );
};

export default MyProfile;