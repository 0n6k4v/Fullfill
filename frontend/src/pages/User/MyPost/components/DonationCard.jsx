import React, { useState, useRef, useEffect } from 'react';
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
  faEllipsisV,
  faCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';

const DonationCard = ({ donation = {}, onEdit, onDelete, onMarkAsComplete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef(null);

  // Ensure donation is an object
  const safeDonation = typeof donation === 'object' && donation !== null ? donation : {};

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === 'fulfilled') {
        onMarkAsComplete(safeDonation.id);
      } else {
        const response = await api.patch(`/users/me/posts/${safeDonation.id}/status`, { 
          status: newStatus 
        });
        
        if (response.status === 200 || response.status === 204) {
          window.location.reload();
        } else {
          console.error('Failed to update item status');
          alert('ไม่สามารถอัพเดทสถานะได้');
        }
      }
      
      setShowStatusMenu(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const getStatusBadge = () => {
    switch(safeDonation.status) {
      case 'available':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">มีอยู่</span>;
      case 'matched':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">จับคู่แล้ว</span>;
      case 'fulfilled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">เสร็จสมบูรณ์</span>;
      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch(safeDonation.status) {
      case 'available':
        return (
          <>
            <button 
              onClick={() => onEdit(safeDonation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1.5" />
              แก้ไข
            </button>
            <button 
              onClick={() => onDelete(safeDonation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
              ลบ
            </button>
          </>
        );
      case 'matched':
        return (
          <>
            <button 
              onClick={() => onMarkAsComplete(safeDonation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
              ทำเครื่องหมายว่าเสร็จสมบูรณ์
            </button>
            <button 
              onClick={() => onEdit(safeDonation.id)} 
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-1.5" />
              ดูคำขอ
            </button>
          </>
        );
      case 'fulfilled':
        return (
          <button 
            onClick={() => onEdit(safeDonation.id)} 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1.5" />
            เพิ่มรายการที่คล้ายกัน
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
          src={safeDonation.image || '/placeholder-image.jpg'} 
          alt={safeDonation.title || 'Donation item'} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button 
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600" />
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="py-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  เปลี่ยนสถานะ
                </div>
                
                <button
                  onClick={() => handleStatusChange('available')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center ${safeDonation.status === 'available' ? 'bg-green-50' : ''}`}
                  disabled={safeDonation.status === 'available'}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  มีอยู่
                  {safeDonation.status === 'available' && (
                    <FontAwesomeIcon icon={faCheck} className="ml-auto text-green-500" />
                  )}
                </button>
                
                <button
                  onClick={() => handleStatusChange('matched')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center ${safeDonation.status === 'matched' ? 'bg-yellow-50' : ''}`}
                  disabled={safeDonation.status === 'matched'}
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  จับคู่แล้ว
                  {safeDonation.status === 'matched' && (
                    <FontAwesomeIcon icon={faCheck} className="ml-auto text-yellow-500" />
                  )}
                </button>
                
                <button
                  onClick={() => handleStatusChange('fulfilled')}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center ${safeDonation.status === 'fulfilled' ? 'bg-blue-50' : ''}`}
                  disabled={safeDonation.status === 'fulfilled'}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  เสร็จสมบูรณ์
                  {safeDonation.status === 'fulfilled' && (
                    <FontAwesomeIcon icon={faCheck} className="ml-auto text-blue-500" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{safeDonation.title || 'ไม่มีชื่อรายการ'}</h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1.5 text-gray-400" />
          {safeDonation.location || 'ไม่ระบุสถานที่'}
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1.5 text-gray-400" />
          โพสต์เมื่อ {safeDonation.date || 'ไม่ระบุวันที่'}
        </div>
        
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {safeDonation.category || 'ไม่ระบุหมวดหมู่'}
          </span>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            จำนวน: {safeDonation.quantity || 0}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{safeDonation.description || 'ไม่มีคำอธิบาย'}</p>
        
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            {safeDonation.views || 0} ครั้งที่ดู
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon icon={faCommentAlt} className="mr-1" />
            {safeDonation.requests || 0} คำขอ
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