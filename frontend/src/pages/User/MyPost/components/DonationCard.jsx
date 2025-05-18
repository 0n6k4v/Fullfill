'use client';

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
  faExclamationCircle,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DonationCard = ({ donation = {}, onEdit, onDelete, onMarkAsComplete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Ensure donation is an object
  const safeDonation = typeof donation === 'object' && donation !== null ? donation : {};

  // ใช้ try-catch เพื่อป้องกันกรณีที่ AuthProvider ไม่มีอยู่
  let user = null;
  try {
    const { useAuth } = require('../../../context/AuthContext');
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log('AuthProvider not available');
  }

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
              onClick={() => setShowConfirmDelete(true)} 
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

  const handleEdit = () => {
    router.push(`/edit-donation/${safeDonation.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/items/${safeDonation.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('เกิดข้อผิดพลาดในการลบรายการ');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      await api.patch(`/items/${safeDonation.id}`, { status: 'completed' });
      router.refresh();
    } catch (error) {
      console.error('Error marking item as complete:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'กำลังดำเนินการ';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={safeDonation.image || '/placeholder-image.jpg'}
          alt={safeDonation.title || 'Donation item'}
          fill
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

      {/* Modal ยืนยันการลบ */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-6">คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'กำลังลบ...' : 'ลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCard;