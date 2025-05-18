import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import PostCard from './PostCard';
import EmptyState from './EmptyState';

const PostsSection = ({ posts = {}, tabs = [] }) => {
  const [activeTab, setActiveTab] = useState('active');

  const renderContent = () => {
    const currentPosts = posts[activeTab] || [];

    if (currentPosts.length === 0) {
      return (
        <EmptyState 
          icon={faBoxOpen}
          title={`No ${activeTab} posts`}
          description="Get started by creating a new post."
          buttonText="Create New Post"
          buttonIcon={faPlus}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post, index) => (
          <PostCard key={post?.id || index} post={post} activeTab={activeTab} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
            <p className="mt-1 text-sm text-gray-500">Your latest donations and requests</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />Filter
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />New Post
            </button>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          {['active', 'matched', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm cursor-pointer !rounded-button ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                {(posts[tab] || []).length}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default PostsSection;