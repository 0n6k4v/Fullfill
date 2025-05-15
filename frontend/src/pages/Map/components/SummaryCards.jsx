import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingHeart, 
  faGift, 
  faCheckCircle, 
  faUsers, 
  faArrowUp 
} from '@fortawesome/free-solid-svg-icons';

const SummaryCards = ({ analyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.totalRequests}
            </h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <FontAwesomeIcon icon={faHandHoldingHeart} className="text-blue-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
            {analyticsData.requestGrowth}%
          </span>
          <span className="text-gray-500 ml-2">vs last period</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Donations</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.totalDonations}
            </h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <FontAwesomeIcon icon={faGift} className="text-green-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
            {analyticsData.donationGrowth}%
          </span>
          <span className="text-gray-500 ml-2">vs last period</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Fulfilled Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.fulfilledRequests}
            </h3>
          </div>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
            {analyticsData.fulfillmentGrowth}%
          </span>
          <span className="text-gray-500 ml-2">vs last period</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.activeUsers}
            </h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <FontAwesomeIcon icon={faUsers} className="text-purple-500" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
            {analyticsData.userGrowth}%
          </span>
          <span className="text-gray-500 ml-2">vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;