import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBookmark, 
faShareAlt, faHandshake, faTag, faHandHoldingHeart, faHeart } from '@fortawesome/free-solid-svg-icons';

const DonationCard = ({ donation = {}, mode }) => {
  const {
    imageUrl = '/images/default-donation.jpg',
    title = 'No Title',
    location = 'Unknown Location',
    distance = '0 km',
    tags = []
  } = donation;

  // Determine button text, icon, and color based on mode
  const buttonText = mode === 'donation' ? 'Request' : 'Donate';
  const buttonIcon = mode === 'donation' ? faHandshake : faHandHoldingHeart;
  const buttonColor = mode === 'donation' 
    ? 'bg-amber-500 hover:bg-amber-600' 
    : 'bg-green-500 hover:bg-green-600';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-white/90 cursor-pointer border border-white/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
          <span className="text-green-500 font-medium text-sm">
            {donation.matchPercentage}% Match
          </span>
        </div>
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <FontAwesomeIcon icon={faHeart} className="text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
          <span>
            {location} ({distance})
          </span>
        </div>
        <div className="flex justify-between">
          <button className={`${buttonColor} text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer`}>
            <FontAwesomeIcon icon={buttonIcon} className="mr-2" />
            {buttonText}
          </button>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 cursor-pointer">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 cursor-pointer">
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;