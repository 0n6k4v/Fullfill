import React from 'react';
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

const PostCard = ({ post = {}, activeTab }) => {
  if (!post || Object.keys(post).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <p className="text-gray-500 p-4">No post data available</p>
      </div>
    );
  }

  const {
    image = '',
    title = '',
    location = '',
    distance = '',
    tags = [],
    type = '',
    category = '',
    postedDate = '',
    matchedWith = '',
    receivedBy = '',
  } = post;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {type}
            </span>
          </div>
          <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
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
              <span>{location} • {distance}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
              <span>Posted {postedDate}</span>
            </div>
            {activeTab === "matched" && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <FontAwesomeIcon icon={faHandshake} className="mr-1" />
                <span>Matched with {matchedWith}</span>
              </div>
            )}
            {activeTab === "completed" && (
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
          {activeTab === "active" && (
            <>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faTimes} className="mr-1" /> Cancel
              </button>
            </>
          )}
          {activeTab === "matched" && (
            <>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Mark as Received
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
              </button>
            </>
          )}
          {activeTab === "completed" && (
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