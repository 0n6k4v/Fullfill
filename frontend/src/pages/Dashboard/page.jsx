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

const Dashboard = () => {
  // States
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Constants
  const tabs = ["Dashboard"];
  const sortOptions = ["Most Recent", "Near Me", "Most Urgent", "Category"];
  const filterOptions = ["All", "Donations", "Requests"];

  // Analytics data for dashboard
  const analyticsData = {
    totalRequests: 1284,
    totalDonations: 956,
    fulfilledRequests: 742,
    activeUsers: 2847,
    requestGrowth: 12.5,
    donationGrowth: 8.2,
    fulfillmentGrowth: 15.3,
    userGrowth: 24.5,
  };

  // Sample data for posts (combined from donationPosts and requestPosts)
  const donationPosts = [
    {
      id: 1,
      type: "Donation",
      user: "Sarah Johnson",
      organization: false,
      time: "2 hours ago",
      location: "San Francisco, CA",
      coordinates: { lat: 37.773972, lng: -122.431297 },
      distance: "1.2 miles",
      title: "Children's Bicycle",
      description:
        "Gently used children's bicycle in good condition. Suitable for ages 5-8.",
      category: "Kids & Toys",
      condition: "Good",
      quantity: 1,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20high-quality%20childrens%20bicycle%20with%20training%20wheels%20on%20a%20clean%20white%20background%2C%20perfect%20for%20a%205-8%20year%20old%20child%2C%20blue%20and%20silver%20color%20scheme%2C%20good%20condition%20with%20minimal%20wear%2C%20professional%20product%20photography%20with%20soft%20lighting&width=300&height=200&seq=1001&orientation=landscape",
      views: 24,
      offers: 3,
      saves: 5,
    },
    {
      id: 2,
      type: "Donation",
      user: "Office Solutions Inc.",
      organization: true,
      time: "5 hours ago",
      location: "San Francisco, CA",
      coordinates: { lat: 37.789972, lng: -122.419297 },
      distance: "2.5 miles",
      title: "Office Desk Chair",
      description:
        "Black ergonomic office chair with adjustable height and armrests. Lightly used.",
      category: "Furniture",
      condition: "Like New",
      quantity: 3,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20black%20ergonomic%20office%20desk%20chair%20with%20adjustable%20height%20and%20armrests%20on%20a%20clean%20white%20background%2C%20minimal%20wear%2C%20excellent%20condition%2C%20comfortable%20padding%2C%20high-quality%20product%20photography%20with%20soft%20lighting&width=300&height=200&seq=1002&orientation=landscape",
      views: 42,
      offers: 7,
      saves: 12,
    },
    {
      id: 3,
      type: "Donation",
      user: "Emma Wilson",
      organization: false,
      time: "1 day ago",
      location: "Oakland, CA",
      coordinates: { lat: 37.804363, lng: -122.271111 },
      distance: "5.8 miles",
      title: "Winter Coat (Medium)",
      description:
        "Navy blue winter coat, medium size. Barely worn, very warm and in excellent condition.",
      category: "Clothing",
      condition: "Excellent",
      quantity: 1,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20navy%20blue%20winter%20coat%20medium%20size%20on%20a%20clean%20white%20background%2C%20excellent%20condition%20with%20no%20visible%20wear%2C%20warm%20insulation%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20showing%20front%20view%20with%20zipper%20and%20pockets&width=300&height=200&seq=1003&orientation=landscape",
      views: 36,
      offers: 5,
      saves: 8,
    },
    {
      id: 4,
      type: "Donation",
      user: "Tech Recyclers",
      organization: true,
      time: "2 days ago",
      location: "San Jose, CA",
      coordinates: { lat: 37.339386, lng: -121.894955 },
      distance: "12.4 miles",
      title: "Microwave Oven",
      description:
        "Functional microwave oven, 1000W. Clean and in working condition.",
      category: "Appliances",
      condition: "Fair",
      quantity: 1,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20silver%20microwave%20oven%20on%20a%20clean%20white%20background%2C%201000W%20power%2C%20fair%20condition%20with%20some%20minor%20wear%20but%20fully%20functional%2C%20clean%20interior%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20front%20view%20with%20control%20panel&width=300&height=200&seq=1004&orientation=landscape",
      views: 28,
      offers: 2,
      saves: 4,
    },
    {
      id: 5,
      type: "Donation",
      user: "Family Essentials",
      organization: true,
      time: "3 days ago",
      location: "Berkeley, CA",
      coordinates: { lat: 37.871666, lng: -122.272781 },
      distance: "7.1 miles",
      title: "Baby Stroller",
      description:
        "Foldable baby stroller with canopy. Suitable for infants and toddlers up to 35 lbs.",
      category: "Baby & Kids",
      condition: "Good",
      quantity: 1,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20black%20foldable%20baby%20stroller%20with%20canopy%20on%20a%20clean%20white%20background%2C%20good%20condition%20with%20minimal%20wear%2C%20suitable%20for%20infants%20and%20toddlers%2C%20comfortable%20padding%2C%20adjustable%20handle%2C%20professional%20product%20photography%20with%20soft%20lighting&width=300&height=200&seq=1005&orientation=landscape",
      views: 52,
      offers: 8,
      saves: 15,
    },
    {
      id: 6,
      type: "Donation",
      user: "Home Goods Donor",
      organization: false,
      time: "4 days ago",
      location: "San Francisco, CA",
      coordinates: { lat: 37.759972, lng: -122.429297 },
      distance: "0.8 miles",
      title: "Bookshelf",
      description:
        "Wooden bookshelf with 4 shelves. Sturdy and in good condition.",
      category: "Furniture",
      condition: "Good",
      quantity: 1,
      status: "Available",
      image:
        "https://readdy.ai/api/search-image?query=A%20wooden%20bookshelf%20with%204%20shelves%20on%20a%20clean%20white%20background%2C%20warm%20oak%20finish%2C%20good%20condition%20with%20minimal%20wear%2C%20sturdy%20construction%2C%20empty%20shelves%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20front%20view&width=300&height=200&seq=1006&orientation=landscape",
      views: 31,
      offers: 4,
      saves: 7,
    },
  ];
  
  const requestPosts = [
    {
      id: 7,
      type: "Request",
      user: "Community Center",
      organization: true,
      time: "1 hour ago",
      location: "San Francisco, CA",
      coordinates: { lat: 37.783972, lng: -122.431297 },
      distance: "1.5 miles",
      title: "School Supplies Needed",
      description:
        "Looking for notebooks, pencils, backpacks, and other school supplies for underprivileged children.",
      category: "Education",
      condition: "Any",
      quantity: "Multiple",
      status: "Active",
      image:
        "https://readdy.ai/api/search-image?query=An%20assortment%20of%20school%20supplies%20including%20notebooks%2C%20pencils%2C%20backpacks%20on%20a%20clean%20white%20background%2C%20colorful%20educational%20materials%20neatly%20arranged%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20various%20essential%20items%20for%20students&width=300&height=200&seq=1007&orientation=landscape",
      views: 87,
      offers: 12,
      saves: 23,
    },
    {
      id: 8,
      type: "Request",
      user: "Maria Lopez",
      organization: false,
      time: "3 hours ago",
      location: "Oakland, CA",
      coordinates: { lat: 37.814363, lng: -122.261111 },
      distance: "6.2 miles",
      title: "Winter Clothes for Family",
      description:
        "Family of four in need of winter clothes. Children ages 5 and 8, adult sizes M and L.",
      category: "Clothing",
      condition: "Good",
      quantity: "Multiple",
      status: "Active",
      image:
        "https://readdy.ai/api/search-image?query=A%20collection%20of%20winter%20clothes%20for%20a%20family%20including%20childrens%20and%20adult%20sizes%20on%20a%20clean%20white%20background%2C%20warm%20jackets%2C%20sweaters%2C%20and%20thermal%20wear%20in%20good%20condition%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20various%20essential%20winter%20items&width=300&height=200&seq=1008&orientation=landscape",
      views: 64,
      offers: 8,
      saves: 14,
    },
    {
      id: 9,
      type: "Request",
      user: "Homeless Shelter",
      organization: true,
      time: "5 hours ago",
      location: "San Francisco, CA",
      coordinates: { lat: 37.779972, lng: -122.419297 },
      distance: "2.1 miles",
      title: "Blankets and Sleeping Bags",
      description:
        "Urgently seeking warm blankets and sleeping bags for our shelter residents as winter approaches.",
      category: "Household",
      condition: "Any",
      quantity: "Multiple",
      status: "Active",
      image:
        "https://readdy.ai/api/search-image?query=A%20stack%20of%20warm%20blankets%20and%20rolled%20sleeping%20bags%20on%20a%20clean%20white%20background%2C%20various%20colors%20and%20patterns%2C%20cozy%20winter%20bedding%20materials%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20essential%20items%20for%20cold%20weather&width=300&height=200&seq=1009&orientation=landscape",
      views: 92,
      offers: 15,
      saves: 28,
    },
    {
      id: 10,
      type: "Request",
      user: "Senior Support Network",
      organization: true,
      time: "1 day ago",
      location: "Daly City, CA",
      coordinates: { lat: 37.688889, lng: -122.471667 },
      distance: "8.3 miles",
      title: "Mobility Aids for Seniors",
      description:
        "Looking for walkers, canes, and other mobility aids for elderly community members with limited mobility.",
      category: "Medical",
      condition: "Good",
      quantity: "Multiple",
      status: "Active",
      image:
        "https://readdy.ai/api/search-image?query=A%20collection%20of%20mobility%20aids%20including%20walkers%2C%20canes%2C%20and%20rollators%20on%20a%20clean%20white%20background%2C%20assistive%20devices%20for%20elderly%20people%2C%20good%20condition%20with%20minimal%20wear%2C%20professional%20product%20photography%20with%20soft%20lighting%20showing%20various%20support%20equipment&width=300&height=200&seq=1010&orientation=landscape",
      views: 45,
      offers: 6,
      saves: 11,
    },
  ];

  // Combine posts for the feed
  const allPosts = [...donationPosts, ...requestPosts].sort((a, b) => b.id - a.id);

  // Filter posts based on active filter
  const getFilteredPosts = () => {
    switch (activeFilter) {
      case "Donations":
        return donationPosts;
      case "Requests":
        return requestPosts;
      default:
        return allPosts;
    }
  };

  // Filter posts based on search query
  const filteredPosts = getFilteredPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle request click
  const handleRequestClick = (postId) => {
    console.log("Request clicked for post:", postId);
    // Here you would normally open a form modal
  };

  // Handle new post
  const handleNewPost = () => {
    console.log("Create new post");
    // Here you would normally open a new post form
  };

  // Load Google Maps API
  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", () => {
      setMapLoaded(true);
    });
    return () => {
      if (window.document.body.contains(googleMapScript)) {
        window.document.body.removeChild(googleMapScript);
      }
    };
  }, []);

  // Initialize map when it's loaded
  useEffect(() => {
    if (mapLoaded && window.google && activeTab === "Map View") {
      const mapOptions = {
        center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        zoom: mapZoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      };
      
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions,
      );
      
      // Add markers for each post
      // ... (keep your existing map marker logic)
    }
  }, [mapLoaded, filteredPosts, mapZoom, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and Sort */}
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
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            <SummaryCards analyticsData={analyticsData} />
            <DashboardCharts />
            <CategoryTable />
          </div>
        )}
      </main>
      
      <FloatingActionButton onClick={handleNewPost} />
      <Footer />
    </div>
  );
};

export default Dashboard;