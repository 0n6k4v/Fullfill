import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt,
  faAddressBook,
  faCheck,
  faTimes,
  faCheckCircle,
  faInfoCircle,
  faMapMarkerAlt,
  faHeart,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match = {} }) => {
  // Ensure match is an object
  const safeMatch = typeof match === 'object' && match !== null ? match : {};
  
  const {
    userAvatar = '/images/default-avatar.jpg',
    user = 'ไม่ระบุผู้ใช้',
    type = 'unknown',
    item = 'ไม่ระบุรายการ',
    status = 'pending',
    date = new Date().toISOString()
  } = safeMatch;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'ยอมรับแล้ว';
      case 'rejected':
        return 'ปฏิเสธแล้ว';
      case 'pending':
      default:
        return 'รอดำเนินการ';
    }
  };

  const getTypeText = (type) => {
    return type === 'incoming' ? 'ต้องการรับ' : 'ต้องการบริจาค';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start space-x-4">
        <img
          src={userAvatar}
          alt={`รูปโปรไฟล์ของ ${user}`}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-avatar.jpg';
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user}</h3>
              <p className="text-sm text-gray-600">{getTypeText(type)} {item}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <span>{new Date(date).toLocaleDateString('th-TH')}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-3">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
          <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> ดูข้อมูลติดต่อ
        </button>
        
        {status === 'pending' && type === 'incoming' ? (
          <>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> ยอมรับ
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> ปฏิเสธ
            </button>
          </>
        ) : status === 'accepted' && type === 'outgoing' ? (
          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> ทำเครื่องหมายว่าได้รับแล้ว
          </button>
        ) : (
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> รายละเอียด
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;