'use client';

import React, { useState, useEffect } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt,
  faBookmark, 
  faUserCircle,
  faShareAlt,
  faHandshake,
  faHandHoldingHeart,
  faThLarge, faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils,
  faClock,
  faUser,
  faHeart,
  faComment,
  faExclamationCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import RequestFormModal from './RequestFormModal';

const PostCard = ({ post = {}, onStatusChange }) => {
  const {
    id,
    title = 'ไม่ระบุชื่อ',
    description = 'ไม่มีคำอธิบาย',
    category = 'ไม่ระบุหมวดหมู่',
    condition = 'ไม่ระบุสภาพ',
    location = 'ไม่ระบุสถานที่',
    image = { url: '/placeholder.jpg' },
    created_at = new Date().toISOString(),
    uploaded_by = { name: 'ไม่ระบุผู้ใช้' },
    status = 'available',
    expire = null,
    matched_userid = null,
    lat = null,
    lon = null
  } = post;

  // State เพื่อควบคุมการแสดง Modal
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState("กำลังคำนวณ...");

  // Helper function for category icons - similar to CatalogPage
  const getCategoryIcon = (categoryId) => {
    if (!categoryId) return faThLarge;
    
    const categoryMap = {
      'furniture': faCouch,
      'clothing': faTshirt,
      'electronics': faLaptop,
      'appliances': faBlender,
      'kids_toys': faBaby,
      'books': faBook,
      'kitchen': faUtensils,
      'other': faThLarge
    };
    
    return categoryMap[categoryId.toLowerCase()] || faThLarge;
  };

  // Helper function for condition colors - similar to CatalogPage
  const getConditionColors = (conditionId) => {
    if (!conditionId) return { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    const conditionId_lower = conditionId.toLowerCase();
    switch (conditionId_lower) {
      case 'new':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
      case 'like_new':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'good':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'fair':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'poor':
        return { bg: 'bg-orange-100', text: 'text-orange-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  // กำหนดไอคอนและสีตามประเภทโพสต์
  const buttonIcon = post?.type === "Offer" ? faHandshake : faHandHoldingHeart;
  const buttonColor = post?.type === "Offer" 
    ? 'bg-amber-500 hover:bg-amber-600' 
    : 'bg-green-500 hover:bg-green-600';

  // ฟังก์ชันที่ทำงานเมื่อกดปุ่ม Request/Offer - แสดงฟอร์มโดยตรง
  const handleRequestClick = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    setShowRequestForm(true);
  };

  // ฟังก์ชันที่ทำงานเมื่อยกเลิก
  const handleCancel = (e) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    setShowRequestForm(false);
  };

  // ฟังก์ชันที่ทำงานเมื่อส่งฟอร์ม
  const handleFormSubmit = (formData) => {
    if (!formData) return;
    console.log("Form submitted with data:", formData);
    setShowRequestForm(false);
    alert("คำขอของคุณถูกส่งเรียบร้อยแล้ว!");
  };

  // Get user location and calculate distance
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!position || !position.coords) return;
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setDistance("ไม่สามารถเข้าถึงตำแหน่งได้");
        }
      );
    } else {
      setDistance("ไม่รองรับการเข้าถึงตำแหน่ง");
    }
  }, []);

  // Calculate distance when user location is available
  useEffect(() => {
    const calculateDistance = async () => {
      if (!userLocation || !post?.lat || !post?.lon) {
        setDistance("ไม่ทราบระยะทาง");
        return;
      }
      
      try {
        const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
        if (!apiKey) {
          throw new Error('Longdo Map API key is not defined');
        }
        
        const url = `https://api.longdo.com/RouteService/json/route/guide?flat=${userLocation.lat}&flon=${userLocation.lon}&tlat=${post.lat}&tlon=${post.lon}&mode=t&type=25&locale=th&key=${apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch distance data');
        }
        const text = await response.text();
      
        try {
          const data = JSON.parse(text);
          
          if (data?.data?.[0]?.distance) {
            const distanceKm = (data.data[0].distance / 1000).toFixed(1);
            setDistance(`${distanceKm} กม.`);
          } else {
            setDistance("ไม่พบเส้นทาง");
          }
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          setDistance("ไม่สามารถคำนวณได้");
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
        setDistance("ไม่สามารถคำนวณได้");
      }
    };
    
    calculateDistance();
  }, [userLocation, post?.lat, post?.lon]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'พร้อมรับบริจาค';
      case 'reserved':
        return 'ถูกจองแล้ว';
      case 'completed':
        return 'ส่งมอบแล้ว';
      case 'expired':
        return 'หมดอายุ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return faHeart;
      case 'reserved':
        return faExclamationCircle;
      case 'completed':
        return faHeart;
      case 'expired':
        return faTimesCircle;
      default:
        return faExclamationCircle;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={image?.url || '/placeholder.jpg'}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
            <FontAwesomeIcon icon={getStatusIcon(status)} className="mr-1" />
            {getStatusText(status)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {condition}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <span>{location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              <span>{formatDate(created_at)}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <span>{uploaded_by?.name}</span>
            </div>
          </div>

          {status === 'available' && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleStatusChange('reserved')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                aria-label="จองสิ่งของ"
              >
                จองสิ่งของ
              </button>
            </div>
          )}

          {status === 'reserved' && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleStatusChange('completed')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                aria-label="ยืนยันการส่งมอบ"
              >
                ยืนยันการส่งมอบ
              </button>
              <button
                onClick={() => handleStatusChange('available')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                aria-label="ยกเลิกการจอง"
              >
                ยกเลิกการจอง
              </button>
            </div>
          )}
        </div>
      </div>

      {showRequestForm && (
        <RequestFormModal
          post={post}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default PostCard;