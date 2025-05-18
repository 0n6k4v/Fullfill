import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList } from '@fortawesome/free-solid-svg-icons';

const ViewModeToggle = ({ 
  viewMode = 'grid', 
  setViewMode = () => {} 
}) => {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <button
        className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"} cursor-pointer`}
        onClick={() => setViewMode("grid")}
        aria-label="แสดงแบบตาราง"
      >
        <FontAwesomeIcon icon={faTh} className="text-gray-500" />
      </button>
      <button
        className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "bg-white"} cursor-pointer`}
        onClick={() => setViewMode("list")}
        aria-label="แสดงแบบรายการ"
      >
        <FontAwesomeIcon icon={faList} className="text-gray-500" />
      </button>
    </div>
  );
};

export default ViewModeToggle;