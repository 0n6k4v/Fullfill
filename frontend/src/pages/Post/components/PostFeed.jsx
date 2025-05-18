import React from 'react';
import PostCard from '@/components/PostCard';
import EmptyState from './EmptyState';

const PostFeed = ({ posts = [], viewMode = 'grid' }) => {
  if (!posts || !Array.isArray(posts)) {
    return <EmptyState />;
  }

  return (
    <div
      className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} viewMode={viewMode} />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default PostFeed;