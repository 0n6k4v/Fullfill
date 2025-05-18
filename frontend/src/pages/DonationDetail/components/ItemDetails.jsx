'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faShareAlt, 
  faFlag, 
  faUser,
  faHandHoldingHeart,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import DonationRequestModal from './DonationRequestModal';

const ItemDetails = ({ item = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!item || Object.keys(item).length === 0) {
    return (
      <div className="md:w-1/2 p-6">
        <p className="text-gray-500">No item details available</p>
      </div>
    );
  }

  const {
    title = '',
    location = '',
    distance = '',
    description = '',
    tags = [],
    donorName = '',
    postedTime = '',
    details = {},
    pickupLocation = '',
    pickupTime = ''
  } = item;

  return (
    <div className="md:w-1/2 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
            <span className="text-gray-600">
              {location} • {distance}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faShareAlt} className="text-gray-600" />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faFlag} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="border-t border-b py-4 my-4">
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800">{donorName}</p>
              <p className="text-gray-500 text-sm">{postedTime}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium flex items-center cursor-pointer !rounded-button whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" />
            ขอรับบริจาค
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">รายละเอียดเพิ่มเติม</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(details).map(([key, value], index) => (
            <div key={index}>
              <p className="text-gray-600 text-sm">{key}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">การรับสินค้า</h2>
          <div className="flex items-start mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600 mt-1 mr-3" />
            <div>
              <p className="font-medium">รับที่บ้านของผู้บริจาค</p>
              <p className="text-gray-600">{pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start">
            <FontAwesomeIcon icon={faClock} className="text-gray-600 mt-1 mr-3" />
            <div>
              <p className="font-medium">เวลาที่สะดวก</p>
              <p className="text-gray-600">{pickupTime}</p>
            </div>
          </div>
        </div>
      </div>
      
      <DonationRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ItemDetails;