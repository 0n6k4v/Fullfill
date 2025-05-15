'use client';

import React, { useState } from "react";
import Header from './components/Header';
import TabsBar from './components/TabsBar';
import SearchAndFilters from './components/SearchAndFilters';
import PostFeed from './components/PostFeed';
import FloatingActionButton from "../../components/FloatingActionButton";
import Footer from "@/components/Footer";
import { donationPosts, requestPosts } from './data/mockData';

const Post = () => {
  const [activeTab, setActiveTab] = useState("All Posts");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = ["Most Recent", "Near Me", "Most Urgent", "Category"];

  // Combine posts for the feed
  const allPosts = [...donationPosts, ...requestPosts].sort((a, b) => {
    // Sort by most recent (using the id as a proxy for recency in this example)
    return b.id - a.id;
  });

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "Donation Posts":
        return donationPosts;
      case "Request Posts":
        return requestPosts;
      case "My Following":
        return allPosts.filter((post) => post.id % 3 === 0);
      default:
        return allPosts;
    }
  };

  const filteredPosts = getFilteredPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        />

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <PostFeed posts={filteredPosts} viewMode={viewMode} />
      </main>

      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default Post;