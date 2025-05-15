import React from 'react';
import Navigation from './components/Navigation';
import WelcomeSection from './components/WelcomeSection';
import AnalyticsSection from './components/AnalyticsSection';
import StatsOverview from './components/StatsOverview';
import PostsSection from './components/PostsSection';
import MatchesSection from './components/MatchesSection';

const Home = () => {
  const user = {
    name: 'John Doe',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar1&orientation=squarish'
  };
  
  const posts = {
    active: [
      {
        id: 1,
        title: 'Office Desk Chair',
        category: 'Furniture',
        location: 'Seattle, CA',
        postedDate: '2 days ago',
        image: 'https://readdy.ai/api/search-image?query=modern%20black%20office%20chair%20with%20ergonomic%20design%2C%20comfortable%20seating%20with%20adjustable%20height%2C%20professional%20photography%20on%20white%20background%2C%20detailed%20texture%2C%20high%20resolution%20product%20image&width=100&height=80&seq=chair1&orientation=portrait'
      },
      {
        id: 2,
        title: 'Microwave Oven',
        category: 'Appliances',
        location: 'Seattle, CA',
        postedDate: '3 days ago',
        image: 'https://readdy.ai/api/search-image?query=modern%20stainless%20steel%20microwave%20oven%20on%20clean%20white%20background%2C%20kitchen%20appliance%20with%20digital%20display%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20buttons%20and%20features&width=100&height=80&seq=microwave1&orientation=landscape'
      }
    ],
    matched: [
      {
        id: 3,
        title: 'Children\'s Bicycle',
        category: 'Toys & Sports',
        location: 'Seattle, CA',
        postedDate: '5 days ago',
        matchedWith: 'Sarah Wilson',
        matchDate: 'May 12, 2025',
        image: 'https://readdy.ai/api/search-image?query=colorful%20children%20bicycle%20with%20training%20wheels%20on%20clean%20white%20background%2C%20blue%20and%20red%20kids%20bike%20for%20beginners%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20features&width=100&height=80&seq=bike1&orientation=landscape'
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Winter Coat',
        category: 'Clothing',
        location: 'Seattle, CA',
        postedDate: '10 days ago',
        completedDate: 'May 10, 2025',
        receivedBy: 'Michael Brown',
        image: 'https://readdy.ai/api/search-image?query=navy%20blue%20winter%20coat%20with%20hood%20and%20fur%20trim%20on%20clean%20white%20background%2C%20warm%20padded%20jacket%2C%20professional%20product%20photography%20with%20soft%20lighting%2C%20detailed%20texture%20and%20zipper%20features&width=100&height=80&seq=coat1&orientation=portrait'
      }
    ]
  };
  
  const matches = [
    {
      id: 1,
      type: 'incoming',
      user: 'Emily Parker',
      userAvatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20friendly%20smile%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar2&orientation=squarish',
      item: 'Bookshelf',
      date: 'May 14, 2025',
      status: 'Pending'
    },
    {
      id: 2,
      type: 'outgoing',
      user: 'David Miller',
      userAvatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%20portrait%20photo%20with%20clean%20background%2C%20professional%20lighting%2C%20detailed%20facial%20features&width=40&height=40&seq=avatar3&orientation=squarish',
      item: 'Baby Stroller',
      date: 'May 13, 2025',
      status: 'Accepted'
    }
  ];
  
  const stats = [
    { label: 'Total Donations', value: 12, icon: 'fa-hand-holding-heart' },
    { label: 'Items Received', value: 8, icon: 'fa-box-open' },
    { label: 'Active Posts', value: 3, icon: 'fa-clipboard-list' },
    { label: 'Completion Rate', value: '98%', icon: 'fa-check-circle' }
  ];
  
  // Analytics data for charts
  const donationsByMonth = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    donations: [3, 5, 4, 6, 8, 12],
    received: [2, 3, 4, 5, 6, 8]
  };
  
  const categoryDistribution = {
    categories: ['Furniture', 'Clothing', 'Electronics', 'Toys', 'Books', 'Other'],
    values: [35, 25, 15, 10, 10, 5]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user} />
        <AnalyticsSection 
          donationsByMonth={donationsByMonth} 
          categoryDistribution={categoryDistribution} 
        />
        <StatsOverview stats={stats} />
        <PostsSection posts={posts} />
        <MatchesSection matches={matches} />
      </main>
    </div>
  );
};

export default Home;