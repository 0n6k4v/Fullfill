import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faHandHoldingHeart,
  faListAlt,
  faAddressBook,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const QuickActions = ({ onAction = () => {} }) => {
  // ฟังก์ชันสำหรับแปลง icon string เป็น FontAwesome icon object
  const getIconObject = (iconName) => {
    if (!iconName) return faPlus;
    
    switch (iconName.toLowerCase()) {
      case 'fa-plus': return faPlus;
      case 'fa-hand-holding-heart': return faHandHoldingHeart;
      case 'fa-list-alt': return faListAlt;
      case 'fa-address-book': return faAddressBook;
      case 'fa-box-open': return faBoxOpen;
      default: return faPlus;
    }
  };
  
  const actions = [
    {
      title: 'บริจาคสิ่งของ',
      description: 'แบ่งปันสิ่งที่คุณมี',
      icon: faHandHoldingHeart,
      color: 'bg-blue-500',
      action: 'donate'
    },
    {
      title: 'ขอรับบริจาค',
      description: 'ค้นหาสิ่งที่คุณต้องการ',
      icon: faBoxOpen,
      color: 'bg-green-500',
      action: 'request'
    },
    {
      title: 'โพสต์ของฉัน',
      description: 'ดูรายการของคุณ',
      icon: faListAlt,
      color: 'bg-purple-500',
      action: 'posts'
    },
    {
      title: 'รายชื่อติดต่อ',
      description: 'ดูข้อมูลติดต่อ',
      icon: faAddressBook,
      color: 'bg-orange-500',
      action: 'contacts'
    }
  ];

  const handleActionClick = (action) => {
    if (!action) return;
    onAction(action);
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleActionClick(action.action)}
          className={`flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color} whitespace-nowrap`}
          aria-label={action.title}
        >
          <FontAwesomeIcon icon={action.icon} className={`${action.color} p-2 rounded-lg text-white mr-3`} />
          <div className="text-left">
            <div className="font-medium">{action.title}</div>
            <div className="text-xs text-gray-500">{action.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;