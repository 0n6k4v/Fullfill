'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

const RecentActivity = ({ userActivityData }) => {
  const [activityFilter, setActivityFilter] = useState('All Activities');
  
  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    let activities = [];
    
    if (activityFilter === 'All Activities' || activityFilter === 'Donations') {
      activities = [...activities, ...userActivityData.recentDonations];
    }
    
    if (activityFilter === 'All Activities' || activityFilter === 'Requests') {
      activities = [...activities, ...userActivityData.recentRequests];
    }
    
    return activities;
  };

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
      <div className="space-y-4">
        {userActivityData.recentDonations.map((donation) => (
          <div
            key={donation.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faGift} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {donation.title}
                </p>
                <p className="text-xs text-gray-500">
                  To: {donation.recipient}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {donation.status}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {donation.date}
              </p>
            </div>
          </div>
        ))}
        {userActivityData.recentRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {request.title}
                </p>
                <p className="text-xs text-gray-500">
                  From: {request.donor}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {request.status}
              </span>
              <p className="text-xs text-gray-500 mt-1">{request.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;