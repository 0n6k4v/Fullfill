import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faAddressBook, 
  faCheck, 
  faTimes, 
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match = {} }) => {
  if (!match || Object.keys(match).length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-gray-500">No match data available</p>
      </div>
    );
  }

  const {
    userAvatar = '',
    user = '',
    type = '',
    item = '',
    status = '',
    date = ''
  } = match;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center">
        <img
          className="h-10 w-10 rounded-full"
          src={userAvatar}
          alt={`${user}'s avatar`}
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user}</p>
          <p className="text-xs text-gray-500">
            {type === "incoming" ? "Offering: " : "Item: "}{item}
          </p>
        </div>
        <div className="ml-auto flex items-center">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : status === "Accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> {date}
      </div>
      <div className="mt-4 flex space-x-3">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
          <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
        </button>
        {type === "incoming" && status === "Pending" ? (
          <>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> Accept
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> Decline
            </button>
          </>
        ) : type === "outgoing" && status === "Accepted" ? (
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