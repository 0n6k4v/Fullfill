"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter, MapPin, Calendar, Tag, X, ChevronDown, Grid, List, Map } from 'lucide-react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faFilter, faChevronUp, faChevronDown, faMapMarkerAlt, faTableCells
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { getItems } from '../../../app/api/items';
import {
  getConditionColors,
  getCategoryIcon,
  getItemDistance,
  getCategories,
  getConditions
} from '../../../utils/itemHelpers';

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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalItems, setTotalItems] = useState(0);

  const [items, setItems] = useState([]);

  // Fetch items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getItems({
          page,
          limit: pageSize,
          type: mode,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          condition: conditionFilter !== 'all' ? conditionFilter : undefined,
          search: searchQuery || undefined,
          location: locationFilter || undefined,
          dateFilter: dateFilter !== 'any' ? dateFilter : undefined
        });

        setItems(result.items || []);
        setTotalItems(result.total || 0);

      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');}
    };

    fetchItems();
  }, [mode, categoryFilter, conditionFilter, locationFilter, dateFilter, searchQuery, page, pageSize]);


  // Helper function to get the icon for a category


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

  // Get paginated items
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const toggleMode = () => {
    setMode(mode === 'donation' ? 'request' : 'donation');
    setPage(1); // Reset to first page when changing mode
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
    setPage(1); // Reset to first page when clearing filters
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Toggle Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center">
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

          <p className="text-gray-600 text-center max-w-2xl mt-4">
            {mode === 'donation' ? (
              <>
                Browse items that people are offering to donate. Click on an item to request it.
                <br />
                "นี่คือรายการที่ผู้คนเสนอให้บริจาค คลิกที่รายการเพื่อขอรับบริจาค"
              </>
            ) : (
              <>
                Browse items that people are looking for. Offer your help by donating these items.
                <br />
                "ค้นหาสินค้าที่ผู้คนกำลังมองหา เสนอความช่วยเหลือของคุณโดยบริจาคสินค้าเหล่านี้"
              </>
            )}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === '') {
                    setPage(1); // Reset to first page when clearing search
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setPage(1); // Reset to first page when submitting search
                  }
                }}
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
                onClick={() => {
                  setViewMode('grid');
                  setPage(1); // Reset to first page when changing view mode
                }}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-indigo-600' : 'bg-white text-gray-600'}`}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faTableCells} />
              </button>
              <button
                onClick={() => {
                  setViewMode('list');
                  setPage(1); // Reset to first page when changing view mode
                }}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-indigo-600' : 'bg-white text-gray-600'}`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => {
                  setViewMode('map');
                  setPage(1); // Reset to first page when changing view mode
                }}
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
                    <FontAwesomeIcon icon={faTableCells} className="mr-2" /> Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1); // Reset to first page when changing category
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {getCategories().map(category => (
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
                    onChange={(e) => {
                      setConditionFilter(e.target.value);
                      setPage(1); // Reset to first page when changing condition
                    }}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {getConditions().map(condition => (
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter location..."
                      value={locationFilter}
                      onChange={(e) => {
                        setLocationFilter(e.target.value);
                        if (e.target.value === '') {
                          setPage(1); // Reset to first page when clearing location
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setPage(1); // Reset to first page when submitting location
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-indigo-600 flex items-center">
                    <FontAwesomeIcon icon={faChevronDown} className="mr-2" /> Date Posted
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setPage(1); // Reset to first page when changing date filter
                    }}
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
      <main className="container mx-auto px-4 py-6">
        {/* Results info */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">{filteredItems.length} items found</p>
          <select
            className="block pl-3 pr-10 py-2 text-sm border-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1); // Reset to first page when changing sort option
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A to Z</option>
            <option value="za">Z to A</option>
          </select>
        </div>

        {/* Map View ให้อ๋องมาใส่ */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-4 mb-6">
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
              <div className="text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Map View</h3>
                <p className="text-gray-600">Map integration will be available soon.</p>
                <p className="text-gray-600">การแสดงผลแผนที่จะมีให้บริการในเร็วๆนี้</p>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/items/${item.id}`}>
                  <img src={item.image.url} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name} {item.id}</h3>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{item.Location}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{getItemDistance(item.Location)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1 line-clamp-2">{item.Description}</p>
                    <div className="text-xs font-medium mb-4">
                        {<span className="text-gray-500"> • Posted: {new Date(item.created_at).toLocaleDateString()}</span>}
                        <br />
                        <span className="text-gray-500">
                          • {item.Expire ? `Expires: ${new Date(item.Expire).toLocaleDateString()}` : 'No expiration date'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-200 text-blue-800">
                          <FontAwesomeIcon icon={getCategoryIcon(item.category)} className="mr-1" />
                          {item.category}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColors(item.Condition).bg} ${getConditionColors(item.Condition).text}`}>
                          {getConditions().find(c => c.id === item.Condition)?.name || item.Condition}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedItems.map(item => (
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
                          {getConditions().find(c => c.id === item.Condition)?.name || item.Condition}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{item.Location}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{getItemDistance(item.Location)}</span>
                      <span className="mx-2 text-gray-300">• </span>
                      <span className="text-sm text-gray-500"> Posted {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.Description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">
                          • {item.Expire ? `Expires: ${new Date(item.Expire).toLocaleDateString()}` : 'No expiration date'}
                        </span>
                      </div>
                      {/* Button to request or offer item */}
                      <Link href={`/items/${item.id}`}>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          {mode === 'donation' ? 'Request Item' : 'Offer Item'}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Only show when not in map view */}
        {filteredItems.length > 0 && viewMode !== 'map' && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex text-sm text-gray-700">
              <p>
                Showing <span className="font-medium">{filteredItems.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
                <span className="font-medium">{Math.min(page * pageSize, filteredItems.length)}</span> of{' '}
                <span className="font-medium">{filteredItems.length}</span> results
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= filteredItems.length}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  page * pageSize >= filteredItems.length
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Next
              </button>
            </div>
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
