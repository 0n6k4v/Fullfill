'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandHoldingHeart, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RecentActivity = ({ userActivityData = null, isLoading = false }) => {
  const [activityFilter, setActivityFilter] = useState('ทั้งหมด');
  
  const handleFilterChange = (e) => {
    if (!e || !e.target) return;
    setActivityFilter(e.target.value);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusMap = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'in_progress': 'bg-blue-100 text-blue-800'
    };
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่มีวันที่';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            กิจกรรมล่าสุด
          </h3>
          <select 
            className="text-sm border-gray-300 rounded-md"
            value={activityFilter}
            onChange={handleFilterChange}
            disabled
          >
            <option>ทั้งหมด</option>
          </select>
        </div>
        <div className="flex justify-center items-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">กำลังโหลดกิจกรรม...</span>
        </div>
      </div>
    );
  }
  
  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    if (!userActivityData) return [];
    
    let activities = [];
    
    if (activityFilter === 'ทั้งหมด' || activityFilter === 'การบริจาค') {
      activities = [...activities, ...(userActivityData.recentDonations || [])];
    }
    
    if (activityFilter === 'ทั้งหมด' || activityFilter === 'คำขอรับบริจาค') {
      activities = [...activities, ...(userActivityData.recentRequests || [])];
    }
    
    // Sort activities by date
    return activities.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
  };

  const activities = getFilteredActivities();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          กิจกรรมล่าสุด
        </h3>
        <select 
          className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={activityFilter}
          onChange={handleFilterChange}
        >
          <option>ทั้งหมด</option>
          <option>การบริจาค</option>
          <option>คำขอรับบริจาค</option>
        </select>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">ไม่พบกิจกรรมล่าสุด</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            if (!activity) return null;
            
            const isDonation = userActivityData?.recentDonations?.some(d => d?.id === activity?.id);
            
            return (
              <div
                key={activity.id || Math.random()}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-2 ${isDonation ? 'bg-green-100' : 'bg-blue-100'} rounded-lg`}>
                    <FontAwesomeIcon 
                      icon={isDonation ? faGift : faHandHoldingHeart} 
                      className={isDonation ? 'text-green-600' : 'text-blue-600'} 
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title || 'ไม่มีชื่อ'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isDonation 
                        ? `ถึง: ${activity.recipient || 'ไม่ระบุ'}` 
                        : `จาก: ${activity.donor || 'ไม่ระบุ'}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(activity.status)
                  }`}>
                    {activity.status || 'ไม่ระบุสถานะ'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;