import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGift, 
  faHandHoldingHeart, 
  faClock, 
  faBookmark 
} from '@fortawesome/free-solid-svg-icons';

const ActivitySummaryCards = ({ analyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              My Donations
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.myDonations}
            </h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <FontAwesomeIcon icon={faGift} className="text-green-500" />
          </div>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all donations
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">My Requests</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.myRequests}
            </h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <FontAwesomeIcon icon={faHandHoldingHeart} className="text-blue-500" />
          </div>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all requests
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Pending Offers
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.pendingOffers}
            </h3>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg">
            <FontAwesomeIcon icon={faClock} className="text-yellow-500" />
          </div>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View pending offers
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Saved Items</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.savedItems}
            </h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <FontAwesomeIcon icon={faBookmark} className="text-purple-500" />
          </div>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View saved items
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummaryCards;