'use client';

import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import UserProfileCard from './components/UserProfileCard';
import FilterControls from './components/FilterControls';
import ActivitySummaryCards from './components/ActivitySummaryCards';
import UserActivityChart from './components/UserActivityChart';
import RecentActivity from './components/RecentActivity';
import PostsSection from "./components/PostsSection";
import MatchesSection from "./components/MatchesSection";
import Footer from "@/components/Footer";
import api from '@/services/api';
import { toast } from 'react-hot-toast';

const MyProfile = () => {
  // States for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [userActivityData, setUserActivityData] = useState(null);
  const [posts, setPosts] = useState({ active: [], matched: [], completed: [] });
  const [matches, setMatches] = useState([]);

  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState("7days");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users/me');
        
        // Format user profile data from API response
        const userData = response.data;
        setUserProfile({
          name: userData.full_name || userData.name || 'User',
          email: userData.email,
          role: userData.role || 'Individual Donor',
          joinedDate: userData.created_at || new Date().toISOString(),
          rating: userData.rating || 0,
          verificationStatus: userData.is_verified ? 'Verified' : 'Unverified',
        });
        
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
        toast.error("Failed to load profile data");
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/users/me/analytics', {
          params: { period: selectedDateRange }
        });
        
        const data = response.data;
        setAnalyticsData({
          myDonations: data.donations_count || 0,
          myRequests: data.requests_count || 0,
          pendingOffers: data.pending_offers_count || 0,
          savedItems: data.saved_items_count || 0,
          totalRequests: data.total_requests || 0,
          totalDonations: data.total_donations || 0,
          fulfilledRequests: data.fulfilled_requests || 0,
          activeUsers: data.active_users || 0,
          requestGrowth: data.request_growth || 0,
          donationGrowth: data.donation_growth || 0,
          fulfillmentGrowth: data.fulfillment_growth || 0,
          userGrowth: data.user_growth || 0,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
        // ใช้ค่าเริ่มต้นในกรณีที่ API ล้มเหลว
        setAnalyticsData({
          myDonations: 0,
          myRequests: 0,
          pendingOffers: 0,
          savedItems: 0
        });
      }
    };

    fetchAnalytics();
  }, [selectedDateRange]);

  // Fetch category data if it's a separate endpoint
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (categoryData) return; // Skip if already loaded with analytics
      
      try {
        const response = await api.get('/api/users/me/categories', {
          params: { period: selectedDateRange }
        });
        
        setCategoryData(response.data);
      } catch (err) {
        console.error("Error fetching category data:", err);
        // Use default empty object
        setCategoryData({});
      }
    };

    fetchCategoryData();
  }, [selectedDateRange, categoryData]);

  // Fetch user activity data
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await api.get('/api/users/me/activity');
        
        setUserActivityData({
          recentDonations: response.data.recent_donations || [],
          recentRequests: response.data.recent_requests || [],
          savedSearches: response.data.saved_searches || []
        });
      } catch (err) {
        console.error("Error fetching user activity:", err);
        setUserActivityData({
          recentDonations: [],
          recentRequests: [],
          savedSearches: []
        });
      }
    };

    fetchUserActivity();
  }, []);

  // Fetch posts data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/users/me/posts', {
          params: { 
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            period: selectedDateRange
          }
        });
        
        // Organize posts by status
        const allPosts = response.data.items || response.data || [];
        
        const organizedPosts = {
          active: allPosts.filter(post => post.status === 'available'),
          matched: allPosts.filter(post => post.status === 'matched'),
          completed: allPosts.filter(post => post.status === 'fulfilled')
        };
        
        setPosts(organizedPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts({ active: [], matched: [], completed: [] });
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, selectedDateRange]);

  // Fetch matches data
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/api/users/me/matches');
        
        // Format matches data
        const matchesData = response.data.map(match => ({
          id: match.id,
          type: match.type, // 'incoming' or 'outgoing'
          user: match.user_name,
          userAvatar: match.user_avatar,
          item: match.item_title,
          date: new Date(match.created_at).toLocaleDateString(),
          status: match.status
        }));
        
        setMatches(matchesData);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setMatches([]);
      }
    };

    fetchMatches();
  }, []);

  if (loading && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-gray-50">
      {/* Header */}
      <Header userProfile={userProfile} />

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
        {analyticsData && (
          <ActivitySummaryCards analyticsData={analyticsData} />
        )}

        {/* Recent Activity and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UserActivityChart />
          {userActivityData && (
            <RecentActivity userActivityData={userActivityData} />
          )}
        </div>

        {/* Posts Section */}
        <PostsSection posts={posts} isLoading={loading} />

        {/* Matches Section */}
        <MatchesSection matches={matches} isLoading={loading} />

      </main>
      
      <Footer />
    </div>
  );
};

export default MyProfile;