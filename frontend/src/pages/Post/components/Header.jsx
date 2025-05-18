'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">รายการทั้งหมด</h1>
            <p className="mt-1 text-sm text-gray-500">
              ค้นหาและกรองรายการบริจาคและคำขอรับบริจาค
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/PostDonation"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="โพสต์การบริจาค"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              โพสต์การบริจาค
            </Link>
            <Link
              href="/RequestItem"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="ขอรับบริจาค"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              ขอรับบริจาค
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;