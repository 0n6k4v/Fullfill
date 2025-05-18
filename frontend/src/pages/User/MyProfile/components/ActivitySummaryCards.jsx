import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHandshake, faHistory } from '@fortawesome/free-solid-svg-icons';

const ActivitySummaryCards = ({ stats = null }) => {
  // Ensure stats is an object and provide default values
  const safeStats = {
    myDonations: 0,
    myRequests: 0,
    completedMatches: 0,
    ...(stats || {})
  };
  
  const formatValue = (val) => {
    if (typeof val !== 'number') return '0';
    return val.toLocaleString('th-TH');
  };
  
  const cards = [
    {
      title: 'การบริจาคของฉัน',
      value: formatValue(safeStats.myDonations),
      icon: faBoxOpen,
      color: 'bg-blue-500',
      description: 'จำนวนรายการที่คุณบริจาค'
    },
    {
      title: 'คำขอรับบริจาคของฉัน',
      value: formatValue(safeStats.myRequests),
      icon: faHandshake,
      color: 'bg-green-500',
      description: 'จำนวนคำขอรับบริจาคที่คุณสร้าง'
    },
    {
      title: 'การจับคู่ที่เสร็จสมบูรณ์',
      value: formatValue(safeStats.completedMatches),
      icon: faHistory,
      color: 'bg-purple-500',
      description: 'จำนวนการจับคู่ที่เสร็จสมบูรณ์'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className={`${card.color} p-3 rounded-lg`}>
              <FontAwesomeIcon icon={card.icon} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummaryCards;