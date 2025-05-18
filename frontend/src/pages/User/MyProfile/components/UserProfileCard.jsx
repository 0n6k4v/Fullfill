import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faStar, faPlus, faHandHoldingHeart, faListAlt, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const UserProfileCard = ({ userProfile = {} }) => {
  const safeUserProfile = typeof userProfile === 'object' && userProfile !== null ? userProfile : {};

  const quickActions = [
    {
      icon: faPlus,
      title: 'บริจาคสิ่งของ',
      description: 'แบ่งปันสิ่งที่คุณมี',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: faHandHoldingHeart,
      title: 'ขอรับสิ่งของ',
      description: 'ค้นหาสิ่งที่คุณต้องการ',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: faListAlt,
      title: 'โพสต์ของฉัน',
      description: 'ดูรายการของคุณ',
      bgColor: 'bg-purple-50',
      hoverBgColor: 'hover:bg-purple-100',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: faAddressBook,
      title: 'รายชื่อติดต่อ',
      description: 'ดูข้อมูลการติดต่อ',
      bgColor: 'bg-orange-50',
      hoverBgColor: 'hover:bg-orange-100',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุวันที่';
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
                {safeUserProfile.username || 'ไม่ระบุชื่อผู้ใช้'}
              </h2>
              <p className="text-sm text-gray-500">{safeUserProfile.email || 'ไม่ระบุอีเมล'}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">
                  สมาชิกตั้งแต่{" "}
                  {formatDate(safeUserProfile.joinedDate)}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center text-sm">
                  <FontAwesomeIcon 
                    icon={faStar} 
                    className="text-yellow-400 mr-1" 
                  />
                  {safeUserProfile.rating || '0'}
                </span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {safeUserProfile.verificationStatus || 'ยังไม่ยืนยันตัวตน'}
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