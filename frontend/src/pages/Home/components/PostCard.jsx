import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag,
  faMapMarkerAlt,
  faClock,
  faHandshake,
  faCheckCircle,
  faEllipsisV,
  faEdit,
  faTimes,
  faCheck,
  faAddressBook,
  faRedo,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

const PostCard = ({ post = {} }) => {
  const {
    imageUrl = '/images/default-post.jpg',
    title = 'No Title',
    location = 'Unknown Location',
    distance = '0 km',
    tags = [],
    category = 'Uncategorized',
    postedDate = new Date().toISOString(),
    matchedWith = null,
    receivedBy = null
  } = post;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
            <FontAwesomeIcon icon={faHeart} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-900">{title}</h4>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faTag} className="mr-1 text-gray-400" />
              <span>{category}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-400" />
              <span>{location}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
              <span>Posted {new Date(postedDate).toLocaleDateString()}</span>
            </div>
            
            {matchedWith && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <FontAwesomeIcon icon={faHandshake} className="mr-1" />
                <span>Matched with {matchedWith}</span>
              </div>
            )}
            
            {receivedBy && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                <span>Received by {receivedBy}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <button className="text-gray-400 hover:text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          {matchedWith && (
            <>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Mark as Received
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
              </button>
            </>
          )}
          
          {receivedBy && (
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> Post Similar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;