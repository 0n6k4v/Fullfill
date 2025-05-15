import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faEye, 
  faCommentAlt,
  faEdit, 
  faTrash, 
  faHandshake,
  faCheck,
  faTimes,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const DonationCard = ({ donation, onEdit, onDelete, onMarkAsComplete }) => {
  const getStatusBadge = () => {
    switch(donation.status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch(donation.status) {
      case 'active':
        return (
          <>
            <button 
              onClick={() => onEdit(donation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1.5" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(donation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
              Delete
            </button>
          </>
        );
      case 'pending':
        return (
          <>
            <button 
              onClick={() => onMarkAsComplete(donation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
              Mark Complete
            </button>
            <button 
              onClick={() => onEdit(donation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-1.5" />
              View Request
            </button>
          </>
        );
      case 'completed':
        return (
          <button 
            onClick={() => onEdit(donation.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1.5" />
            Add Similar
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={donation.image} 
          alt={donation.title} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
        <div className="absolute top-2 right-2">
          <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{donation.title}</h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1.5 text-gray-400" />
          {donation.location}
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1.5 text-gray-400" />
          Posted on {donation.date}
        </div>
        
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {donation.category}
          </span>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Quantity: {donation.quantity}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{donation.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            {donation.views} views
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon icon={faCommentAlt} className="mr-1" />
            {donation.requests} requests
          </span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;