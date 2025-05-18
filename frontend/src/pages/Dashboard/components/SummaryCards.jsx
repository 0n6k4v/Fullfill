import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingHeart, 
  faGift, 
  faCheckCircle, 
  faUsers, 
  faArrowUp,
  faArrowDown // Add faArrowDown for negative growth
} from '@fortawesome/free-solid-svg-icons';

const GrowthIndicator = ({ value }) => {
  const isPositive = value >= 0;
  return (
    <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
      <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} className="mr-1" />
      {Math.abs(value)}%
    </span>
  );
};

const SummaryCards = ({ analyticsData }) => {
  if (!analyticsData) {
    // Optional: Render a loading state or null if handled by parent
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
  }

  const cards = [
    { title: "Total Requests", value: analyticsData.totalRequests, growth: analyticsData.requestGrowth, icon: faHandHoldingHeart, color: "blue" },
    { title: "Total Donations", value: analyticsData.totalDonations, growth: analyticsData.donationGrowth, icon: faGift, color: "green" },
    { title: "Fulfilled Requests", value: analyticsData.fulfilledRequests, growth: analyticsData.fulfillmentGrowth, icon: faCheckCircle, color: "indigo" },
    { title: "Active Users", value: analyticsData.activeUsers, growth: analyticsData.userGrowth, icon: faUsers, color: "purple" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <div key={card.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {card.value !== undefined ? card.value.toLocaleString() : 'N/A'}
              </h3>
            </div>
            <div className={`p-3 bg-${card.color}-50 rounded-lg`}>
              <FontAwesomeIcon icon={card.icon} className={`text-${card.color}-500 text-xl`} />
            </div>
          </div>
          {card.growth !== undefined && (
            <div className="mt-4 flex items-center text-sm">
              <GrowthIndicator value={card.growth} />
              <span className="text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;