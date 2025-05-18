'use client';

import { Suspense } from 'react';
import WelcomeSection from './components/WelcomeSection';
import QuickActions from './components/QuickActions';
import PostsSection from './components/PostsSection';
import MatchesSection from './components/MatchesSection';
import AnalyticsSection from './components/AnalyticsSection';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <WelcomeSection />
          <QuickActions />
          <PostsSection />
          <MatchesSection />
          <AnalyticsSection />
        </Suspense>
      </main>
    </div>
  );
}