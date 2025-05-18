import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

const SavedSearches = ({ savedSearches = [] }) => {
  // Ensure savedSearches is an array
  const safeSearches = Array.isArray(savedSearches) ? savedSearches : [];

  if (safeSearches.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            การค้นหาที่บันทึกไว้
          </h3>
        </div>
        <p className="text-gray-500">ไม่พบการค้นหาที่บันทึกไว้</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          การค้นหาที่บันทึกไว้
        </h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
          จัดการทั้งหมด
        </button>
      </div>
      <div className="space-y-4">
        {safeSearches.map((search) => {
          if (!search || typeof search !== 'object') return null;
          
          const safeSearch = {
            id: search.id || 'unknown',
            query: search.query || 'ไม่ระบุคำค้นหา',
            category: search.category || 'ไม่ระบุหมวดหมู่',
            location: search.location || 'ไม่ระบุสถานที่'
          };

          return (
            <div
              key={safeSearch.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FontAwesomeIcon icon={faSearch} className="text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {safeSearch.query}
                  </p>
                  <p className="text-xs text-gray-500">
                    {safeSearch.category} • {safeSearch.location}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <FontAwesomeIcon icon={faBell} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedSearches;