import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faAddressBook, 
  faCheck, 
  faTimes, 
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const MatchCard = ({ match = {} }) => {
  // Ensure match is an object
  const safeMatch = typeof match === 'object' && match !== null ? match : {};

  if (Object.keys(safeMatch).length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-gray-500">ไม่พบข้อมูลการจับคู่</p>
      </div>
    );
  }

  const {
    userAvatar = '',
    user = '',
    type = '',
    item = '',
    status = '',
    date = ''
  } = safeMatch;

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (String(status).toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่มีวันที่';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center">
        <img
          className="h-10 w-10 rounded-full"
          src={userAvatar || '/images/default-avatar.png'}
          alt={`รูปโปรไฟล์ของ ${user || 'ผู้ใช้'}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-avatar.png';
          }}
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user || 'ไม่ระบุชื่อ'}</p>
          <p className="text-xs text-gray-500">
            {type === "incoming" ? "เสนอ: " : "รายการ: "}{item || 'ไม่ระบุรายการ'}
          </p>
        </div>
        <div className="ml-auto flex items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
            {status || 'ไม่ระบุสถานะ'}
          </span>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> {formatDate(date)}
      </div>
      <div className="mt-4 flex space-x-3">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
          <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> ดูข้อมูลติดต่อ
        </button>
        {type === "incoming" && status === "Pending" ? (
          <>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> ยอมรับ
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faTimes} className="mr-1" /> ปฏิเสธ
            </button>
          </>
        ) : type === "outgoing" && status === "Accepted" ? (
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