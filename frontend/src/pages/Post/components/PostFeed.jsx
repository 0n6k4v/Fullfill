'use client';

import React from 'react';
import PostCard from '@/components/PostCard';

const PostFeed = ({ 
  posts = [], 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ไม่พบรายการ</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;