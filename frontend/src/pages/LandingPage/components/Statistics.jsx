'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faUsers, faMapMarkerAlt, faRecycle } from '@fortawesome/free-solid-svg-icons';

const Statistics = () => {
  const stats = [
    {
      icon: faHandHoldingHeart,
      value: '1,000+',
      label: 'การบริจาคสำเร็จ',
      description: 'จำนวนการบริจาคที่ประสบความสำเร็จ'
    },
    {
      icon: faUsers,
      value: '500+',
      label: 'ผู้ใช้งาน',
      description: 'จำนวนผู้ใช้งานที่ลงทะเบียนในระบบ'
    },
    {
      icon: faMapMarkerAlt,
      value: '10+',
      label: 'จังหวัด',
      description: 'พื้นที่ที่ให้บริการ'
    },
    {
      icon: faRecycle,
      value: '2,000+',
      label: 'สิ่งของ',
      description: 'จำนวนสิ่งของที่ถูกบริจาค'
    }
  ];

  return (
    <div className="bg-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            ผลงานของเรา
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            ตัวเลขที่แสดงถึงความสำเร็จในการช่วยเหลือสังคม
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
                    <FontAwesomeIcon icon={stat.icon} className="h-8 w-8" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="mt-2 text-lg font-medium text-gray-900">{stat.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;