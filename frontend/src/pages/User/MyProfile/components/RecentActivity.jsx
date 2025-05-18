'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandHoldingHeart, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RecentActivity = ({ userActivityData, isLoading = false }) => {
  const [activityFilter, setActivityFilter] = useState('All Activities');
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Activity
          </h3>
          <select 
            className="text-sm border-gray-300 rounded-md"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            disabled
          >
            <option>All Activities</option>
          </select>
        </div>
        <div className="flex justify-center items-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">Loading activities...</span>
        </div>
      </div>
    );
  }
  
  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    if (!userActivityData) return [];
    
    let activities = [];
    
    if (activityFilter === 'All Activities' || activityFilter === 'Donations') {
      activities = [...activities, ...(userActivityData.recentDonations || [])];
    }
    
    if (activityFilter === 'All Activities' || activityFilter === 'Requests') {
      activities = [...activities, ...(userActivityData.recentRequests || [])];
    }
    
    return activities;
  };

  const activities = getFilteredActivities();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Recent Activity
        </h3>
        <select 
          className="text-sm border-gray-300 rounded-md"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
        >
          <option>All Activities</option>
          <option>Donations</option>
          <option>Requests</option>
        </select>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const isDonation = userActivityData.recentDonations.some(d => d.id === activity.id);
            
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isDonation ? `To: ${activity.recipient}` : `From: ${activity.donor}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDonation 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
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