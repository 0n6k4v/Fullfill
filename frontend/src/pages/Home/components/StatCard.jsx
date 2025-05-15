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

const StatCard = ({ stat, index }) => {
  const getColorClass = (index) => {
    switch (index) {
      case 0: return 'bg-blue-100 text-blue-600';
      case 1: return 'bg-yellow-100 text-yellow-600';
      case 2: return 'bg-green-100 text-green-600';
      case 3: return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  // สร้างฟังก์ชันเพื่อแปลงชื่อไอคอนเป็น icon object
  const getIconObject = (iconName) => {
    switch (iconName) {
      case 'fa-hand-holding-heart': return faHandHoldingHeart;
      case 'fa-box-open': return faBoxOpen;
      case 'fa-clipboard-list': return faClipboardList;
      case 'fa-check-circle': return faCheckCircle;
      default: return faHandHoldingHeart; // Default icon
    }
  };
  
  const colorClass = getColorClass(index);
  const iconObject = getIconObject(stat.icon);
  const textColorClass = colorClass.split(' ')[1]; // Get only the text color class
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass.split(' ')[0]}`}>
              <FontAwesomeIcon 
                icon={iconObject} 
                className={`${textColorClass} text-xl`} 
              />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;