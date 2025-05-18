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
  faInfoCircle,
  faMapMarkerAlt,
  faHeart,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match = {} }) => {
  const {
    userAvatar = '/images/default-avatar.jpg',
    user = 'Unknown User',
    type = 'unknown',
    item = 'Unknown Item',
    status = 'pending',
    date = new Date().toISOString()
  } = match;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start space-x-4">
        <img
          src={userAvatar}
          alt={user}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user}</h3>
              <p className="text-sm text-gray-600">{type === 'incoming' ? 'wants to receive' : 'wants to donate'} {item}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-3">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
          <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
        </button>
        
        {status === 'Pending' && type === 'incoming' ? (
          <>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> Accept
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> Decline
            </button>
          </>
        ) : status === 'Accepted' && type === 'outgoing' ? (
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