import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faHandHoldingHeart,
  faListAlt,
  faAddressBook
} from '@fortawesome/free-solid-svg-icons';

const QuickActions = () => {
  // ฟังก์ชันสำหรับแปลง icon string เป็น FontAwesome icon object
  const getIconObject = (iconName) => {
    switch (iconName) {
      case 'fa-plus': return faPlus;
      case 'fa-hand-holding-heart': return faHandHoldingHeart;
      case 'fa-list-alt': return faListAlt;
      case 'fa-address-book': return faAddressBook;
      default: return faPlus;
    }
  };
  
  const actions = [
    {
      title: 'Donate Item',
      description: 'Share what you have',
      icon: 'fa-plus',
      color: 'blue',
    },
    {
      title: 'Request Item',
      description: 'Find what you need',
      icon: 'fa-hand-holding-heart',
      color: 'green',
    },
    {
      title: 'My Posts',
      description: 'View your listings',
      icon: 'fa-list-alt',
      color: 'purple',
    },
    {
      title: 'Contacts',
      description: 'View contact info',
      icon: 'fa-address-book',
      color: 'orange',
    }
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      {actions.map((action, index) => (
        <div 
          key={index}
          className={`bg-${action.color}-50 rounded-lg p-5 flex flex-col items-center transition duration-150 ease-in-out hover:bg-${action.color}-100 cursor-pointer !rounded-button whitespace-nowrap`}
        >
          <div className={`w-12 h-12 rounded-full bg-${action.color}-100 flex items-center justify-center mb-3`}>
            <FontAwesomeIcon 
              icon={getIconObject(action.icon)} 
              className={`text-${action.color}-600`} 
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
          <p className="mt-1 text-xs text-gray-500">{action.description}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;