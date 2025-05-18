'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const EmptyDonationState = ({ tab }) => {
  const router = useRouter();

  const getMessage = () => {
    switch (tab) {
      case 'active':
        return 'คุณยังไม่มีรายการที่กำลังดำเนินการ';
      case 'completed':
        return 'คุณยังไม่มีรายการที่เสร็จสิ้น';
      case 'cancelled':
        return 'คุณยังไม่มีรายการที่ถูกยกเลิก';
      default:
        return 'คุณยังไม่มีรายการบริจาค';
    }
  };

  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getMessage()}
      </h3>
      <p className="text-gray-600 mb-6">
        เริ่มต้นการบริจาคของคุณโดยการเพิ่มรายการใหม่
      </p>
      <button
        onClick={() => router.push('/post-donation')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
        เพิ่มรายการใหม่
      </button>
    </div>
  );
};

export default EmptyDonationState;