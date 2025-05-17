// Catalog items data used throughout the application
// This would be replaced by API fetch in production

export const items = [
  {
    id: 1,
    TYPE: 'donation', // 'donation' or 'request'
    name: 'Winter Jacket (Size L)',
    category: 'clothing',
    Condition: 'good',
    Description: 'Warm winter jacket in excellent condition. Size Large, dark blue color.',
    Location: 'Downtown',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-01T10:30:00Z',
    updated_at: '2025-05-01T10:30:00Z',
    uploaded_by: 101,
    Status: 1, // 1: available, 2: reserved, 3: completed
    Expire: '2025-06-01T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Jane Smith",
      avatar: "/api/placeholder/50/50",
      rating: 4.7,
      joinDate: "2024-01-15",
      itemsShared: 12
    },
    additionalImages: [
      "/api/placeholder/300/200?image=1",
      "/api/placeholder/300/200?image=2",
      "/api/placeholder/300/200?image=3"
    ]
  },
  {
    id: 2,
    TYPE: 'donation',
    name: 'Coffee Table',
    category: 'furniture',
    Condition: 'fair',
    Description: 'Wooden coffee table, minor scratches but sturdy and functional.',
    Location: 'Westside',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-04T14:15:00Z',
    updated_at: '2025-05-04T14:15:00Z',
    uploaded_by: 102,
    Status: 1,
    Expire: '2025-06-04T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Robert Johnson",
      avatar: "/api/placeholder/50/50",
      rating: 4.2,
      joinDate: "2024-03-20",
      itemsShared: 5
    },
    additionalImages: [
      "/api/placeholder/300/200?image=4",
      "/api/placeholder/300/200?image=5"
    ]
  },
  {
    id: 3,
    TYPE: 'donation',
    name: 'Laptop (2022 Model)',
    category: 'electronics',
    Condition: 'good',
    Description: 'Laptop in working condition. 8GB RAM, 256GB SSD. No charger included.',
    Location: 'Northside',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-06T09:45:00Z',
    updated_at: '2025-05-06T09:45:00Z',
    uploaded_by: 103,
    Status: 1,
    Expire: '2025-06-06T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Michael Chen",
      avatar: "/api/placeholder/50/50",
      rating: 4.9,
      joinDate: "2024-02-05",
      itemsShared: 9
    },
    additionalImages: [
      "/api/placeholder/300/200?image=6"
    ]
  },
  {
    id: 4,
    TYPE: 'donation',
    name: 'Children\'s Books',
    category: 'Books',
    Condition: 'like_new',
    Description: 'Collection of 15 children\'s books, suitable for ages 3-8.',
    Location: 'Eastside',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-03T16:20:00Z',
    updated_at: '2025-05-03T16:20:00Z',
    uploaded_by: 104,
    Status: 1,
    Expire: '2025-06-03T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Sophia Williams",
      avatar: "/api/placeholder/50/50",
      rating: 4.6,
      joinDate: "2024-01-30",
      itemsShared: 15
    },
    additionalImages: [
      "/api/placeholder/300/200?image=7",
      "/api/placeholder/300/200?image=8"
    ]
  },
  {
    id: 5,
    TYPE: 'donation',
    name: 'Board Games',
    category: 'Kids & toys',
    Condition: 'Good',
    Description: 'Set of classic board games including Monopoly and Scrabble.',
    Location: 'Downtown',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-07T11:10:00Z',
    updated_at: '2025-05-07T11:10:00Z',
    uploaded_by: 105,
    Status: 1,
    Expire: '2025-06-07T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Emily Rodriguez",
      avatar: "/api/placeholder/50/50",
      rating: 4.3,
      joinDate: "2024-04-10",
      itemsShared: 7
    }
  },
  {
    id: 6,
    TYPE: 'donation',
    name: 'Microwave Oven',
    category: 'appliances',
    Condition: 'Good',
    Description: '700W microwave, works perfectly. Clean and in good condition.',
    Location: 'Southside',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-02T13:25:00Z',
    updated_at: '2025-05-02T13:25:00Z',
    uploaded_by: 106,
    Status: 1,
    Expire: '2025-06-02T00:00:00Z',
    matched_userid: null,
    user: {
      name: "David Taylor",
      avatar: "/api/placeholder/50/50",
      rating: 4.4,
      joinDate: "2024-01-20",
      itemsShared: 6
    }
  },
  {
    id: 7,
    TYPE: 'donation',
    name: 'Kitchen Blender',
    category: 'Kitchen',
    Condition: 'like_new',
    Description: 'Powerful 1000W blender, hardly used. Perfect for smoothies and food preparation.',
    Location: 'Northside',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-10T08:30:00Z',
    updated_at: '2025-05-10T08:30:00Z',
    uploaded_by: 107,
    Status: 1,
    Expire: '2025-06-10T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/50/50",
      rating: 4.8,
      joinDate: "2024-03-05",
      itemsShared: 10
    }
  },
  {
    id: 8,
    TYPE: 'request',
    name: 'Winter Coat (Medium)',
    category: 'clothing',
    Condition: 'good',
    Description: 'Looking for a warm winter coat, size medium. Preferably in dark colors.',
    Location: 'Capitol Hill, Seattle',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-05T12:30:00Z',
    updated_at: '2025-05-05T12:30:00Z',
    uploaded_by: 108,
    Status: 1,
    Expire: '2025-06-05T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Jessica Clark",
      avatar: "/api/placeholder/50/50",
      rating: 4.5,
      joinDate: "2024-02-15",
      itemsShared: 4
    }
  },
  {
    id: 9,
    TYPE: 'request',
    name: 'Snow Boots Size 9',
    category: 'clothing',
    Condition: 'fair',
    Description: 'Need a pair of snow boots for the winter, men\'s size 9.',
    Location: 'Ballard, Seattle',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-06T13:45:00Z',
    updated_at: '2025-05-06T13:45:00Z',
    uploaded_by: 109,
    Status: 1,
    Expire: '2025-06-06T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Thomas Wilson",
      avatar: "/api/placeholder/50/50",
      rating: 4.2,
      joinDate: "2024-01-25",
      itemsShared: 3
    }
  },
  {
    id: 10,
    TYPE: 'request',
    name: 'Winter Gloves',
    category: 'clothing',
    Condition: 'any',
    Description: 'Looking for a pair of warm winter gloves, any condition as long as they\'re functional.',
    Location: 'Queen Anne, Seattle',
    image: { url: '/api/placeholder/600/400' },
    created_at: '2025-05-07T09:15:00Z',
    updated_at: '2025-05-07T09:15:00Z',
    uploaded_by: 110,
    Status: 1,
    Expire: '2025-06-07T00:00:00Z',
    matched_userid: null,
    user: {
      name: "Lisa Martinez",
      avatar: "/api/placeholder/50/50",
      rating: 4.6,
      joinDate: "2024-02-10",
      itemsShared: 5
    }
  }
];
