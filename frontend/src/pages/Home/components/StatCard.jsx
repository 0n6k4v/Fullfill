import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingHeart,
  faBoxOpen,
  faClipboardList,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ 
  title = 'No Title', 
  value = 0, 
  icon = null, 
  color = 'bg-blue-500',
  change = 0,
  changeType = 'neutral'
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        {icon && (
          <div className={`${color} p-3 rounded-lg`}>
            <FontAwesomeIcon icon={icon} className="text-white text-xl" />
          </div>
        )}
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change !== 0 && (
            <p className={`text-sm ${getChangeColor(changeType)}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;