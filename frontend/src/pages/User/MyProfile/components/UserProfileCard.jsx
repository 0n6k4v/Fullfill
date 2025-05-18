import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar, faPlus, faHandHoldingHeart, faListAlt, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const UserProfileCard = ({ userProfile }) => {
  const quickActions = [
    {
      icon: faPlus,
      title: 'Donate Item',
      description: 'Share what you have',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: faHandHoldingHeart,
      title: 'Request Item',
      description: 'Find what you need',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: faListAlt,
      title: 'My Posts',
      description: 'View your listings',
      bgColor: 'bg-purple-50',
      hoverBgColor: 'hover:bg-purple-100',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: faAddressBook,
      title: 'Contacts',
      description: 'View contact info',
      bgColor: 'bg-orange-50',
      hoverBgColor: 'hover:bg-orange-100',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faUserCircle} 
                className="text-gray-400 text-5xl" 
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">
                {userProfile.username}
              </h2>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(userProfile.joinedDate).toLocaleDateString()}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center text-sm">
                  <FontAwesomeIcon 
                    icon={faStar} 
                    className="text-yellow-400 mr-1" 
                  />
                  {userProfile.rating}
                </span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {userProfile.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {quickActions.map((action, index) => (
            <div key={index} className={`${action.bgColor} rounded-lg p-5 flex flex-col items-center transition duration-150 ease-in-out ${action.hoverBgColor} cursor-pointer !rounded-button whitespace-nowrap`}>
              <div className={`w-12 h-12 rounded-full ${action.iconBgColor} flex items-center justify-center mb-3`}>
                <FontAwesomeIcon icon={action.icon} className={action.iconColor} />
              </div>
              <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;