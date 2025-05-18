'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

const DonationCard = ({ donation = {} }) => {
  const {
    id = '',
    title = 'ไม่มีชื่อ',
    description = 'ไม่มีคำอธิบาย',
    image = '/placeholder.jpg',
    location = 'ไม่ระบุตำแหน่ง',
    postedAt = 'ไม่ระบุเวลา',
    postedBy = 'ไม่ระบุผู้โพสต์',
    condition = 'ไม่ระบุสภาพ'
  } = donation;

  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    like_new: 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800',
    poor: 'bg-red-100 text-red-800'
  };

  const conditionLabels = {
    new: 'ใหม่',
    like_new: 'เหมือนใหม่',
    good: 'ดี',
    fair: 'พอใช้',
    poor: 'แย่'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/Post/${id}`} className="block">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[condition] || 'bg-gray-100 text-gray-800'}`}>
              {conditionLabels[condition] || 'ไม่ระบุสภาพ'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              <span>{postedAt}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-1" />
              <span className="line-clamp-1">{postedBy}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DonationCard;