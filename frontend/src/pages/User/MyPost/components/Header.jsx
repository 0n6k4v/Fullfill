import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const DonationHeader = ({ onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track all your donation listings
        </p>
      </div>
      <button
        onClick={onAddNew}
        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none !rounded-button whitespace-nowrap cursor-pointer"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add New Donation
      </button>
    </div>
  );
};

export default DonationHeader;