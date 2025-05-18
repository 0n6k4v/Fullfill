'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <FontAwesomeIcon 
        icon={faSearch} 
        className="mx-auto h-12 w-12 text-gray-400"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบรายการ</h3>
      <p className="mt-1 text-sm text-gray-500">ลองปรับเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
    </div>
  );
};

export default EmptyState;