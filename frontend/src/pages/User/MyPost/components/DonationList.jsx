'use client';

import React, { useState, useEffect } from 'react';
import DonationCard from './DonationCard';
import EmptyDonationState from './EmptyDonationState';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const DonationList = ({ tab = 'all' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // ถ้าไม่มี user ให้ return
        if (!user) {
          setItems([]);
          return;
        }

        let response;
        switch (tab) {
          case 'active':
            response = await api.get(`/items/user/${user.id}?status=active`);
            break;
          case 'completed':
            response = await api.get(`/items/user/${user.id}?status=completed`);
            break;
          case 'all':
          default:
            response = await api.get(`/items/user/${user.id}`);
            break;
        }

        setItems(response.data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [tab, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyDonationState tab={tab} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DonationCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default DonationList;