import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandshake, faCheckCircle, faUsers } from '@fortawesome/free-solid-svg-icons';

const DonationStats = ({ stats = {} }) => {
  // Ensure stats is an object
  const safeStats = typeof stats === 'object' && stats !== null ? stats : {};

  const statItems = [
    { 
      title: 'การบริจาคทั้งหมด', 
      value: safeStats.total || 0, 
      icon: faGift, 
      iconBg: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
    { 
      title: 'ที่มีอยู่', 
      value: safeStats.available || 0, 
      icon: faGift, 
      iconBg: 'bg-green-100', 
      iconColor: 'text-green-600' 
    },
    { 
      title: 'ที่จับคู่แล้ว', 
      value: safeStats.matched || 0, 
      icon: faHandshake, 
      iconBg: 'bg-yellow-100', 
      iconColor: 'text-yellow-600' 
    },
    { 
      title: 'ที่เสร็จสมบูรณ์', 
      value: safeStats.fulfilled || 0, 
      icon: faCheckCircle, 
      iconBg: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center"
        >
          <div className={`p-3 rounded-full ${item.iconBg} mr-4`}>
            <FontAwesomeIcon icon={item.icon} className={`${item.iconColor} text-xl`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{item.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationStats;