import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SocialButton = ({ 
  icon = null, 
  text = 'Unknown', 
  onClick = () => {},
  color = 'text-gray-600'
}) => {
  if (!icon) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex justify-center items-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition !rounded-button whitespace-nowrap cursor-pointer ${color}`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {text}
    </button>
  );
};

export default SocialButton;