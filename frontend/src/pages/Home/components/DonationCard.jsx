import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBookmark, 
faShareAlt, faHandshake, faTag
} from '@fortawesome/free-solid-svg-icons';

const DonationCard = ({ donation }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-white/90 cursor-pointer border border-white/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
          <span className="text-green-500 font-medium text-sm">
            {donation.matchPercentage}% Match
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {donation.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
          <span>{donation.category}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
          <span>
            {donation.location} ({donation.distance})
          </span>
        </div>
        <div className="flex justify-between">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
            <FontAwesomeIcon icon={faHandshake} className="mr-2" />
            Request
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