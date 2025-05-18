'use client';

import React, { useState } from 'react';
import PostCard from './PostCard';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter,
  faPlus,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const PostsSection = ({ posts = { active: [], matched: [], completed: [] } }) => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Ensure posts is an object with default values
  const safePosts = typeof posts === 'object' && posts !== null ? posts : { active: [], matched: [], completed: [] };
  
  // Ensure each tab has an array
  const safeActivePosts = Array.isArray(safePosts.active) ? safePosts.active : [];
  const safeMatchedPosts = Array.isArray(safePosts.matched) ? safePosts.matched : [];
  const safeCompletedPosts = Array.isArray(safePosts.completed) ? safePosts.completed : [];
  
  // Map tab names to Thai
  const tabNames = {
    active: 'กำลังดำเนินการ',
    matched: 'จับคู่แล้ว',
    completed: 'เสร็จสมบูรณ์'
  };
  
  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">กิจกรรมล่าสุด</h3>
            <p className="mt-1 text-sm text-gray-500">การบริจาคและคำขอล่าสุดของคุณ</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              กรอง
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              โพสต์ใหม่
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tabNames[tab]}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                {safePosts[tab]?.length || 0}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {safePosts[activeTab]?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safePosts[activeTab].map((post) => (
              post && post.id ? (
                <PostCard key={post.id} post={post} activeTab={activeTab} />
              ) : null
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีโพสต์{tabNames[activeTab]}</h3>
            <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการสร้างโพสต์ใหม่</p>
            <div className="mt-6">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                สร้างโพสต์ใหม่
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsSection;