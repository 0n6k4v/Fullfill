import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faPlus } from '@fortawesome/free-solid-svg-icons';

const EmptyDonationState = ({ activeTab, onAddNew }) => {
  let message = '';
  
  switch(activeTab) {
    case 'all':
      message = "You haven't created any donations yet";
      break;
    case 'active':
      message = "You don't have any active donation listings";
      break;
    case 'pending':
      message = "You don't have any pending donation requests";
      break;
    case 'completed':
      message = "You haven't completed any donations yet";
      break;
    default:
      message = "No donations found";
  }

  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
      <FontAwesomeIcon icon={faGift} className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
      <p className="mt-1 text-sm text-gray-500">Start by creating your first donation listing.</p>
      <div className="mt-6">
        <button
          onClick={onAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Donation
        </button>
      </div>
    </div>
  );
};

export default EmptyDonationState;