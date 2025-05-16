import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SocialButton = ({ icon, platform, color }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition !rounded-button whitespace-nowrap cursor-pointer"
    >
      <FontAwesomeIcon icon={icon} className={`${color} mr-2`} />
      {platform}
    </button>
  );
};

export default SocialButton;