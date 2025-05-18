import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmptyState = ({ 
  icon, 
  title = 'ไม่พบข้อมูล', 
  description = 'ยังไม่มีข้อมูลในส่วนนี้', 
  buttonText, 
  buttonIcon, 
  onButtonClick 
}) => {
  // Ensure icon is valid
  if (!icon) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">ไม่สามารถแสดงไอคอนได้</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <FontAwesomeIcon icon={icon} className="text-3xl" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {buttonText && onButtonClick && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onButtonClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer !rounded-button whitespace-nowrap"
          >
            {buttonIcon && <FontAwesomeIcon icon={buttonIcon} className="mr-2" />}
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;