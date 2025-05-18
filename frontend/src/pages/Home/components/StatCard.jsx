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
  stat = {},
  index = 0
}) => {
  // Ensure stat is an object
  const safeStat = typeof stat === 'object' && stat !== null ? stat : {};
  
  const {
    title = 'ไม่มีชื่อ',
    value = 0,
    icon = null,
    color = 'bg-blue-500',
    change = 0,
    changeType = 'neutral'
  } = safeStat;

  const getChangeColor = (type) => {
    if (!type) return 'text-gray-600';
    
    switch (String(type).toLowerCase()) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (val) => {
    if (typeof val !== 'number' || isNaN(val)) return '0';
    return val.toLocaleString('th-TH');
  };

  const formatChange = (val) => {
    if (typeof val !== 'number' || isNaN(val)) return '0';
    return val > 0 ? `+${val}` : val;
  };

  const getIcon = (idx) => {
    const icons = [faHandHoldingHeart, faBoxOpen, faClipboardList, faCheckCircle];
    const safeIndex = typeof idx === 'number' && !isNaN(idx) ? idx : 0;
    return icons[safeIndex % icons.length];
  };

  const getColor = (idx) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const safeIndex = typeof idx === 'number' && !isNaN(idx) ? idx : 0;
    return colors[safeIndex % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`${getColor(index)} p-3 rounded-lg`}>
          <FontAwesomeIcon icon={getIcon(index)} className="text-white text-xl" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{formatValue(value)}</p>
          {change !== 0 && (
            <p className={`text-sm ${getChangeColor(changeType)}`}>
              {formatChange(change)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;