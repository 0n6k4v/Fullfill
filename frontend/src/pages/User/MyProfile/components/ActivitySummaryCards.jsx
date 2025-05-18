import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faHandshake, faHistory } from '@fortawesome/free-solid-svg-icons';

const ActivitySummaryCards = ({ stats }) => {
  // Ensure stats is an object and provide default values
  const safeStats = stats || {};
  
  const cards = [
    {
      title: 'My Donations',
      value: safeStats.myDonations || 0,
      icon: faBoxOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'My Requests',
      value: safeStats.myRequests || 0,
      icon: faHandshake,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Matches',
      value: safeStats.completedMatches || 0,
      icon: faHistory,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`${card.color} p-3 rounded-lg`}>
              <FontAwesomeIcon icon={card.icon} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummaryCards;