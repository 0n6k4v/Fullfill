import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

const SavedSearches = ({ savedSearches }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Saved Searches
        </h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
          Manage All
        </button>
      </div>
      <div className="space-y-4">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FontAwesomeIcon icon={faSearch} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {search.query}
                </p>
                <p className="text-xs text-gray-500">
                  {search.category} • {search.location}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <FontAwesomeIcon icon={faBell} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;