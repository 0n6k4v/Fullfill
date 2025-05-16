"use client";

import React, { useState } from 'react';
import { List } from 'lucide-react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faMapMarkerAlt, faSearch, faFilter, faChevronUp, faChevronDown,
  faHandshake, faHandHoldingHeart  // เพิ่มไอคอนเหล่านี้
} from '@fortawesome/free-solid-svg-icons';

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
  const [conditionFilter, setConditionFilter] = useState('all'); // Added condition filter
  const [sortOption, setSortOption] = useState('newest'); // Added sort option state

  // Predefined locations
  const locations = [
    "All Locations",
    "Downtown, Seattle",
    "Capitol Hill, Seattle",
    "Ballard, Seattle",
    "Fremont, Seattle",
    "Queen Anne, Seattle",
    "University District, Seattle",
  ];

  // Helper function to get the icon for a category
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
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

  // Categories based on ER diagram enum definitions
  const categories = [
    { id: 'all', name: 'All Items', icon: faThLarge },
    { id: 'furniture', name: 'Furniture', icon: faCouch },
    { id: 'clothing', name: 'Clothing', icon: faTshirt },
    { id: 'electronics', name: 'Electronics', icon: faLaptop },
    { id: 'appliances', name: 'Appliances', icon: faBlender },
    { id: 'Kids & toys', name: 'Kids & Toys', icon: faBaby },
    { id: 'Books', name: 'Books', icon: faBook },
    { id: 'Kitchen', name: 'Kitchen', icon: faUtensils },
    { id: 'Other', name: 'Other', icon: faThLarge }
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

  // Sample items for demonstration based on ER diagram Item_FulFill entity
  const items = [
    {
      id: 1,
      TYPE: 'donation', // 'donation' or 'request'
      name: 'Winter Jacket (Size L)',
      category: 'clothing',
      Condition: 'good',
      Description: 'Warm winter jacket in excellent condition. Size Large, dark blue color.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-01T10:30:00Z',
      updated_at: '2025-05-01T10:30:00Z',
      uploaded_by: 101,
      Status: 1, // 1: available, 2: reserved, 3: completed
      Expire: '2025-06-01T00:00:00Z',
      matched_userid: null
    },
    {
      id: 2,
      TYPE: 'donation',
      name: 'Coffee Table',
      category: 'furniture',
      Condition: 'fair',
      Description: 'Wooden coffee table, minor scratches but sturdy and functional.',
      Location: 'Westside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-04T14:15:00Z',
      updated_at: '2025-05-04T14:15:00Z',
      uploaded_by: 102,
      Status: 1,
      Expire: '2025-06-04T00:00:00Z',
      matched_userid: null
    },
    {
      id: 3,
      TYPE: 'donation',
      name: 'Laptop (2022 Model)',
      category: 'electronics',
      Condition: 'good',
      Description: 'Laptop in working condition. 8GB RAM, 256GB SSD. No charger included.',
      Location: 'Northside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-06T09:45:00Z',
      updated_at: '2025-05-06T09:45:00Z',
      uploaded_by: 103,
      Status: 1,
      Expire: '2025-06-06T00:00:00Z',
      matched_userid: null
    },
    {
      id: 4,
      TYPE: 'donation',
      name: 'Children\'s Books',
      category: 'Books',
      Condition: 'like_new',
      Description: 'Collection of 15 children\'s books, suitable for ages 3-8.',
      Location: 'Eastside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-03T16:20:00Z',
      updated_at: '2025-05-03T16:20:00Z',
      uploaded_by: 104,
      Status: 1,
      Expire: '2025-06-03T00:00:00Z',
      matched_userid: null
    },
    {
      id: 5,
      TYPE: 'donation',
      name: 'Board Games',
      category: 'Kids & toys',
      Condition: 'Good',
      Description: 'Set of classic board games including Monopoly and Scrabble.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-07T11:10:00Z',
      updated_at: '2025-05-07T11:10:00Z',
      uploaded_by: 105,
      Status: 1,
      Expire: '2025-06-07T00:00:00Z',
      matched_userid: null
    },
    {
      id: 6,
      TYPE: 'donation',
      name: 'Microwave Oven',
      category: 'appliances',
      Condition: 'Good',
      Description: '700W microwave, works perfectly. Clean and in good condition.',
      Location: 'Southside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-02T13:25:00Z',
      updated_at: '2025-05-02T13:25:00Z',
      uploaded_by: 106,
      Status: 1,
      Expire: '2025-06-02T00:00:00Z',
      matched_userid: null
    },
    {
      id: 7,
      TYPE: 'donation',
      name: 'Kitchen Blender',
      category: 'Kitchen',
      Condition: 'like_new',
      Description: 'Powerful 1000W blender, hardly used. Perfect for smoothies and food preparation.',
      Location: 'Northside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-10T08:30:00Z',
      updated_at: '2025-05-10T08:30:00Z',
      uploaded_by: 107,
      Status: 1,
      Expire: '2025-06-10T00:00:00Z',
      matched_userid: null
    },
    {
      id: 8,
      TYPE: 'donation',
      name: 'Office Chair',
      category: 'furniture',
      Condition: 'Good',
      Description: 'Ergonomic office chair with adjustable height and lumbar support. Black color.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-08T15:45:00Z',
      updated_at: '2025-05-08T15:45:00Z',
      uploaded_by: 108,
      Status: 1,
      Expire: '2025-06-08T00:00:00Z',
      matched_userid: null
    },
    {
      id: 9,
      TYPE: 'donation',
      name: 'Baby Stroller',
      category: 'Kids & toys',
      Condition: 'Fair',
      Description: 'Lightweight baby stroller, foldable design. Some wear but still works great.',
      Location: 'Eastside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-05T11:20:00Z',
      updated_at: '2025-05-05T11:20:00Z',
      uploaded_by: 109,
      Status: 2, // Reserved
      Expire: '2025-06-05T00:00:00Z',
      matched_userid: 201
    },
    {
      id: 10,
      TYPE: 'donation',
      name: 'Acoustic Guitar',
      category: 'Other',
      Condition: 'Good',
      Description: 'Yamaha acoustic guitar with case. Great for beginners. Needs new strings.',
      Location: 'Westside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-09T16:15:00Z',
      updated_at: '2025-05-09T16:15:00Z',
      uploaded_by: 110,
      Status: 1,
      Expire: '2025-06-09T00:00:00Z',
      matched_userid: null
    },
    {
      id: 11,
      TYPE: 'request',
      name: 'Child\'s Bicycle',
      category: 'Kids & toys',
      Condition: 'Good',
      Description: 'Looking for a bicycle suitable for a 6-year-old. Preferably with training wheels.',
      Location: 'Northside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-12T09:30:00Z',
      updated_at: '2025-05-12T09:30:00Z',
      uploaded_by: 111,
      Status: 1,
      Expire: '2025-06-12T00:00:00Z',
      matched_userid: null
    },
    {
      id: 12,
      TYPE: 'request',
      name: 'Winter Boots (Size 8)',
      category: 'clothing',
      Condition: 'Fair',
      Description: 'Need warm winter boots for the upcoming season. Women\'s size 8.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-11T14:00:00Z',
      updated_at: '2025-05-11T14:00:00Z',
      uploaded_by: 112,
      Status: 1,
      Expire: '2025-06-11T00:00:00Z',
      matched_userid: null
    },
    {
      id: 13,
      TYPE: 'request',
      name: 'School Textbooks',
      category: 'Books',
      Condition: 'any',
      Description: 'Looking for high school math and science textbooks for the new school year.',
      Location: 'Southside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-13T10:45:00Z',
      updated_at: '2025-05-13T10:45:00Z',
      uploaded_by: 113,
      Status: 1,
      Expire: '2025-06-13T00:00:00Z',
      matched_userid: null
    },
    {
      id: 14,
      TYPE: 'request',
      name: 'Desk Lamp',
      category: 'Other',
      Condition: 'any',
      Description: 'Need a desk lamp for studying. Preferably LED with adjustable brightness.',
      Location: 'Eastside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-14T08:15:00Z',
      updated_at: '2025-05-14T08:15:00Z',
      uploaded_by: 114,
      Status: 2, // Reserved
      Expire: '2025-06-14T00:00:00Z',
      matched_userid: 202
    },
    {
      id: 15,
      TYPE: 'donation',
      name: 'Dining Table with 4 Chairs',
      category: 'furniture',
      Condition: 'Good',
      Description: 'Wooden dining set. Table dimensions: 120x80cm. Chairs are sturdy and comfortable.',
      Location: 'Westside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-12T15:30:00Z',
      updated_at: '2025-05-12T16:45:00Z',
      uploaded_by: 115,
      Status: 3, // Completed
      Expire: '2025-06-12T00:00:00Z',
      matched_userid: 203
    },
    {
      id: 16,
      TYPE: 'donation',
      name: 'Rice Cooker',
      category: 'Kitchen',
      Condition: 'Like New',
      Description: '5-cup automatic rice cooker with steamer basket. Used only a few times.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-13T13:10:00Z',
      updated_at: '2025-05-13T13:10:00Z',
      uploaded_by: 116,
      Status: 1,
      Expire: '2025-06-13T00:00:00Z',
      matched_userid: null
    },
    {
      id: 17,
      TYPE: 'request',
      name: 'Laptop Charger',
      category: 'electronics',
      Condition: 'Any',
      Description: 'Need a charger for HP laptop model 15-dy1024wm. 65W adapter with USB-C connector.',
      Location: 'Northside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-15T09:25:00Z',
      updated_at: '2025-05-15T09:25:00Z',
      uploaded_by: 117,
      Status: 1,
      Expire: '2025-06-15T00:00:00Z',
      matched_userid: null
    },
    {
      id: 18,
      TYPE: 'request',
      name: 'Small Microwave',
      category: 'appliances',
      Condition: 'Fair',
      Description: 'Looking for a small microwave for a studio apartment. Any brand is fine.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-16T11:40:00Z',
      updated_at: '2025-05-16T11:40:00Z',
      uploaded_by: 118,
      Status: 3, // Completed
      Expire: '2025-06-16T00:00:00Z',
      matched_userid: 204
    },
    {
      id: 19,
      TYPE: 'donation',
      name: 'Men\'s Suits (Size 42)',
      category: 'clothing',
      Condition: 'Good',
      Description: 'Two men\'s suits, navy and charcoal, size 42 regular. Dry cleaned and ready to wear.',
      Location: 'Eastside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-17T14:20:00Z',
      updated_at: '2025-05-17T14:20:00Z',
      uploaded_by: 119,
      Status: 2, // Reserved
      Expire: '2025-06-17T00:00:00Z',
      matched_userid: 205
    },
    {
      id: 20,
      TYPE: 'donation',
      name: 'Gaming Console',
      category: 'electronics',
      Condition: 'Good',
      Description: 'PlayStation 4 with one controller and 5 games. Works perfectly, just upgraded to newer model.',
      Location: 'Westside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-18T16:10:00Z',
      updated_at: '2025-05-18T16:10:00Z',
      uploaded_by: 120,
      Status: 3, // Completed
      Expire: '2025-06-18T00:00:00Z',
      matched_userid: 206
    },
    {
      id: 21,
      TYPE: 'request',
      name: 'Bedside Table',
      category: 'furniture',
      Condition: 'Any',
      Description: 'Looking for a small bedside table or nightstand for a new apartment.',
      Location: 'Southside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-19T10:15:00Z',
      updated_at: '2025-05-19T10:15:00Z',
      uploaded_by: 121,
      Status: 2, // Reserved
      Expire: '2025-06-19T00:00:00Z',
      matched_userid: 207
    },
    {
      id: 22,
      TYPE: 'donation',
      name: 'Knife Set',
      category: 'Kitchen',
      Condition: 'Like New',
      Description: '15-piece kitchen knife set with block. High-quality stainless steel, barely used.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-20T13:30:00Z',
      updated_at: '2025-05-20T13:30:00Z',
      uploaded_by: 122,
      Status: 1,
      Expire: '2025-06-20T00:00:00Z',
      matched_userid: null
    },
    {
      id: 23,
      TYPE: 'request',
      name: 'Baby Clothes',
      category: 'Kids & toys',
      Condition: 'Good',
      Description: 'Looking for baby clothes for 6-12 month old. Any gender neutral colors preferred.',
      Location: 'Northside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-21T09:45:00Z',
      updated_at: '2025-05-21T09:45:00Z',
      uploaded_by: 123,
      Status: 1,
      Expire: '2025-06-21T00:00:00Z',
      matched_userid: null
    },
    {
      id: 24,
      TYPE: 'donation',
      name: 'Fiction Book Collection',
      category: 'Books',
      Condition: 'Good',
      Description: 'Collection of 20+ fiction books including mysteries, thrillers, and classics.',
      Location: 'Eastside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-22T11:20:00Z',
      updated_at: '2025-05-22T11:20:00Z',
      uploaded_by: 124,
      Status: 1,
      Expire: '2025-06-22T00:00:00Z',
      matched_userid: null
    },
    {
      id: 25,
      TYPE: 'request',
      name: 'Toaster Oven',
      category: 'appliances',
      Condition: 'Fair',
      Description: 'Looking for a small toaster oven for a dorm room. Doesn\'t need to be fancy.',
      Location: 'Westside',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-23T14:50:00Z',
      updated_at: '2025-05-23T14:50:00Z',
      uploaded_by: 125,
      Status: 1,
      Expire: '2025-06-23T00:00:00Z',
      matched_userid: null
    },
    {
      id: 26,
      TYPE: 'donation',
      name: 'Yoga Mat and Blocks',
      category: 'Other',
      Condition: 'Good',
      Description: 'Yoga mat with two foam blocks and a strap. Lightly used, clean and ready to use.',
      Location: 'Downtown',
      image: { url: '/api/placeholder/300/200' },
      created_at: '2025-05-24T08:30:00Z',
      updated_at: '2025-05-24T08:30:00Z',
      uploaded_by: 126,
      Status: 1,
      Expire: '2025-06-24T00:00:00Z',
      matched_userid: null
    }
  ];

  // Filter items based on current filters
  const filteredItems = items.filter(item => {
    // Filter by TYPE (mode)
    if (item.TYPE !== mode) return false;

    // Filter by category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // Filter by condition
    if (conditionFilter !== 'all' && item.Condition !== conditionFilter) return false;

    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.Description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Filter by location
    if (locationFilter && !item.Location.toLowerCase().includes(locationFilter.toLowerCase())) return false;

    // Filter by date
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const itemDate = new Date(item.created_at).toISOString().split('T')[0];
      if (itemDate !== today) return false;
    }

    if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (new Date(item.created_at) < oneWeekAgo) return false;
    }

    if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      if (new Date(item.created_at) < oneMonthAgo) return false;
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

  // Helper function to get simulated distance from user to item
  const getItemDistance = (itemLocation) => {
    // In a real app, you would calculate this based on actual coordinates
    // For now, we'll just simulate distances with predefined values
    const distanceMap = {
      'Downtown': '0.5 mi',
      'Downtown, Seattle': '0.5 mi',
      'Capitol Hill, Seattle': '1.2 mi',
      'Ballard, Seattle': '3.7 mi',
      'Fremont, Seattle': '2.5 mi',
      'Queen Anne, Seattle': '1.8 mi',
      'University District, Seattle': '4.3 mi',
      'Westside': '2.1 mi',
      'Eastside': '5.2 mi',
      'Northside': '3.9 mi',
      'Southside': '4.1 mi',
    };

    return distanceMap[itemLocation] || '~3.0 mi'; // Default if location not in our map
  };

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
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
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
                  <FontAwesomeIcon icon={faChevronUp} className="mr-1" /> Clear all
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
          <p className="text-gray-600">{filteredItems.length} items found</p>
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

        {/* Map View */}
        {viewMode === 'map' && (
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
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img src={item.image.url} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.Location}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{getItemDistance(item.Location)}</span>
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
                        {conditions.find(c => c.id === item.Condition)?.name || item.Condition}
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
        {viewMode === 'list' && (
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
                          {conditions.find(c => c.id === item.Condition)?.name || item.Condition}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{item.Location}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{getItemDistance(item.Location)}</span>
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
        {filteredItems.length === 0 && (
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