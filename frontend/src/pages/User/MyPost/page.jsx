'use client';

import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/Header';
import Header from '@/components/Header';
import DonationStats from './components/DonationStats';
import DonationFilters from './components/DonationFilters';
import DonationTabs from './components/DonationTabs';
import DonationList from './components/DonationList';
import Pagination from './components/Pagination';

const MyDonation = () => {
  // State for user
  const [user, setUser] = useState({
    name: 'John Doe',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar1&orientation=squarish',
  });

  // States for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  // Categories for filter dropdown
  const categories = [
    { label: 'Furniture', value: 'furniture' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Toys', value: 'toys' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Sports', value: 'sports' },
  ];

  // Sample statistics data
  const donationStats = {
    total: 24,
    pending: 5,
    completed: 12,
    recipients: 8,
  };

  // Sample donation counts for tabs
  const donationCounts = {
    all: 24,
    active: 7,
    pending: 5,
    completed: 12,
  };

  // Sample donation data
  const allDonations = [
    {
      id: 1,
      title: 'Office Chair',
      description: 'Black ergonomic office chair in good condition. Minor wear on armrests.',
      category: 'Furniture',
      quantity: 1,
      location: 'Seattle, WA',
      date: 'May 12, 2025',
      status: 'active',
      views: 24,
      requests: 3,
      image: 'https://readdy.ai/api/search-image?query=black%20ergonomic%20office%20chair%20with%20adjustable%20height%20and%20arms%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=chair1&orientation=landscape',
    },
    {
      id: 2,
      title: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand, compatible with all laptop sizes.',
      category: 'Electronics',
      quantity: 1,
      location: 'Seattle, WA',
      date: 'May 10, 2025',
      status: 'pending',
      views: 18,
      requests: 2,
      image: 'https://readdy.ai/api/search-image?query=silver%20aluminum%20laptop%20stand%20with%20adjustable%20height%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=stand1&orientation=landscape',
    },
    {
      id: 3,
      title: "Children's Books Set",
      description: "'Set of 10 children's books for ages 5-8, educational stories with colorful illustrations.'",
      category: 'Books',
      quantity: 10,
      location: 'Seattle, WA',
      date: 'May 5, 2025',
      status: 'completed',
      views: 32,
      requests: 4,
      image: 'https://readdy.ai/api/search-image?query=stack%20of%20colorful%20children%27s%20books%20with%20educational%20themes%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=books1&orientation=landscape',
    },
    {
      id: 4,
      title: 'Winter Jackets',
      description: 'Two winter jackets, sizes M and L, in good condition.',
      category: 'Clothing',
      quantity: 2,
      location: 'Seattle, WA',
      date: 'April 28, 2025',
      status: 'active',
      views: 15,
      requests: 1,
      image: 'https://readdy.ai/api/search-image?query=two%20winter%20jackets%20in%20blue%20and%20black%20colors%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=jackets1&orientation=landscape',
    },
    {
      id: 5,
      title: 'Microwave Oven',
      description: '700W microwave oven in working condition, clean and well-maintained.',
      category: 'Kitchen',
      quantity: 1,
      location: 'Seattle, WA',
      date: 'April 25, 2025',
      status: 'completed',
      views: 28,
      requests: 5,
      image: 'https://readdy.ai/api/search-image?query=modern%20microwave%20oven%20in%20stainless%20steel%20finish%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=microwave1&orientation=landscape',
    },
    {
      id: 6,
      title: 'Tennis Rackets',
      description: 'Set of 2 tennis rackets with a bag, lightly used.',
      category: 'Sports',
      quantity: 2,
      location: 'Seattle, WA',
      date: 'April 20, 2025',
      status: 'pending',
      views: 12,
      requests: 1,
      image: 'https://readdy.ai/api/search-image?query=two%20tennis%20rackets%20with%20carrying%20bag%2C%20professional%20product%20photography%20on%20white%20background%2C%20high%20quality&width=400&height=300&seq=tennis1&orientation=landscape',
    },
  ];

  // Filtered donations based on active tab, search and filters
  const [filteredDonations, setFilteredDonations] = useState([]);

  // Effect to filter donations when anything changes
  useEffect(() => {
    let results = allDonations;
    
    // Filter by tab
    if (activeTab !== 'all') {
      results = results.filter(donation => donation.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(donation => 
        donation.title.toLowerCase().includes(query) || 
        donation.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(donation => 
        donation.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Sort results
    switch (selectedSort) {
      case 'oldest':
        results = [...results].sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'mostRequested':
        results = [...results].sort((a, b) => b.requests - a.requests);
        break;
      case 'leastRequested':
        results = [...results].sort((a, b) => a.requests - b.requests);
        break;
      default: // 'newest'
        results = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    setFilteredDonations(results);
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedCategory, selectedSort]);

  // Handlers for card actions
  const handleAddNew = () => {
    alert('Opening form to add a new donation');
    // Here you would normally open a form modal or navigate to create page
  };

  const handleEdit = (id) => {
    alert(`Editing donation ${id}`);
    // Here you would normally open an edit form
  };

  const handleDelete = (id) => {
    alert(`Deleting donation ${id}`);
    // Here you would show a confirmation dialog
  };

  const handleMarkAsComplete = (id) => {
    alert(`Marking donation ${id} as complete`);
    // Here you would update the status
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          setActiveTab={setActiveTab} 
          donationCounts={donationCounts}
        />
        
        {/* Donation List */}
        <DonationList 
          donations={filteredDonations}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkAsComplete={handleMarkAsComplete}
          onAddNew={handleAddNew}
        />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default MyDonation;