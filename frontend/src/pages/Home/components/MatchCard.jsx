import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt,
  faAddressBook,
  faCheck,
  faTimes,
  faCheckCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match }) => {
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center">
        <img 
          className="h-10 w-10 rounded-full" 
          src={match.userAvatar} 
          alt={`${match.user}'s avatar`} 
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{match.user}</p>
          <p className="text-xs text-gray-500">
            {match.type === 'incoming' ? 'Offering: ' : 'Item: '}{match.item}
          </p>
        </div>
        <div className="ml-auto flex items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(match.status)}`}>
            {match.status}
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> {match.date}
      </div>
      
      <div className="mt-4 flex space-x-3">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
          <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
        </button>
        
        {match.status === 'Pending' && match.type === 'incoming' ? (
          <>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> Accept
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> Decline
            </button>
          </>
        ) : match.status === 'Accepted' && match.type === 'outgoing' ? (
          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Mark as Received
          </button>
        ) : (
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> Details
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;