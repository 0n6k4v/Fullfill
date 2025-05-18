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

const PostCard = ({ post = null }) => {
  if (!post) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm p-4">
        <p className="text-gray-500 text-center">ไม่พบข้อมูลโพสต์</p>
      </div>
    );
  }

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

  const handleHeartClick = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement heart functionality
  };

  const handleOptionsClick = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement options menu
  };

  const handleMarkAsReceived = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement mark as received functionality
  };

  const handleViewContact = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement view contact functionality
  };

  const handlePostSimilar = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement post similar functionality
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-40 bg-gray-200 overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-post.jpg';
            }}
          />
          <button 
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
            onClick={handleHeartClick}
          >
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
              <span>โพสต์เมื่อ {new Date(postedDate).toLocaleDateString('th-TH')}</span>
            </div>
            
            {matchedWith && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <FontAwesomeIcon icon={faHandshake} className="mr-1" />
                <span>จับคู่กับ {matchedWith}</span>
              </div>
            )}
            
            {receivedBy && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                <span>ได้รับโดย {receivedBy}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <button 
              className="text-gray-400 hover:text-gray-500 cursor-pointer !rounded-button whitespace-nowrap"
              onClick={handleOptionsClick}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          {matchedWith && (
            <>
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap"
                onClick={handleMarkAsReceived}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-1" /> ทำเครื่องหมายว่าได้รับแล้ว
              </button>
              <button 
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                onClick={handleViewContact}
              >
                <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> ดูข้อมูลติดต่อ
              </button>
            </>
          )}
          
          {receivedBy && (
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
              onClick={handlePostSimilar}
            >
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> โพสต์ที่คล้ายกัน
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;