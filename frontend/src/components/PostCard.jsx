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
  faBook, faUtensils
} from '@fortawesome/free-solid-svg-icons';
import RequestFormModal from './RequestFormModal';

const PostCard = ({ post, viewMode }) => {
  // State เพื่อควบคุมการแสดง Modal
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState("กำลังคำนวณ...");

  // Helper function for category icons - similar to CatalogPage
  const getCategoryIcon = (categoryId) => {
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
    
    return categoryMap[categoryId?.toLowerCase()] || faThLarge;
  };

  // Helper function for condition colors - similar to CatalogPage
  const getConditionColors = (conditionId) => {
    const conditionId_lower = conditionId?.toLowerCase();
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
  const buttonIcon = post.type === "Offer" ? faHandshake : faHandHoldingHeart;
  const buttonColor = post.type === "Offer" 
    ? 'bg-amber-500 hover:bg-amber-600' 
    : 'bg-green-500 hover:bg-green-600';

  // ฟังก์ชันที่ทำงานเมื่อกดปุ่ม Request/Offer - แสดงฟอร์มโดยตรง
  const handleRequestClick = () => {
    setShowRequestForm(true);
  };

  // ฟังก์ชันที่ทำงานเมื่อยกเลิก
  const handleCancel = () => {
    setShowRequestForm(false);
  };

  // ฟังก์ชันที่ทำงานเมื่อส่งฟอร์ม
  const handleFormSubmit = (formData) => {
    console.log("Form submitted with data:", formData);
    setShowRequestForm(false);
    alert("คำขอของคุณถูกส่งเรียบร้อยแล้ว!");
  };

  // Get user location and calculate distance
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Calculate distance when user location is available
  useEffect(() => {
    const calculateDistance = async () => {
      if (!userLocation || !post.lat || !post.lon) {
        setDistance("ไม่ทราบระยะทาง");
        return;
      }
      
      try {
        const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
        const url = `https://api.longdo.com/RouteService/json/route/guide?flat=${userLocation.lat}&flon=${userLocation.lon}&tlat=${post.lat}&tlon=${post.lon}&mode=t&type=25&locale=th&key=${apiKey}`;
        
        const response = await fetch(url);
        const text = await response.text();
      
        try {
          const data = JSON.parse(text);
          
          if (data && data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].distance) {
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
  }, [userLocation, post.lat, post.lon]);

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow ${
          viewMode === "list" ? "flex" : ""
        }`}
      >
        <div
          className={`${viewMode === "list" ? "w-1/3 h-full" : "h-48"} relative`}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                post.type === "Offer"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {post.type === "Offer" ? "Donation" : "Request"}
            </span>
          </div>
        </div>

        <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {post.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-red-500" />
                <span>
                  {post.location} • {distance}
                </span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-500 cursor-pointer">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {/* Category Tag - Updated to match CatalogPage style */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
              <FontAwesomeIcon icon={getCategoryIcon(post.category)} className="mr-1" size="sm" />
              {post.category}
            </span>
            
            {/* Condition Tag - Updated to match CatalogPage style */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getConditionColors(post.condition).bg} ${getConditionColors(post.condition).text}`}>
              {post.condition}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 text-xl" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {/* Mock user name for now */}
                  {post.uploaded_by ? `User #${post.uploaded_by}` : "Anonymous User"}
                </p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <button 
              onClick={handleRequestClick}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${buttonColor} focus:outline-none !rounded-button whitespace-nowrap`}
            >
              <FontAwesomeIcon icon={buttonIcon} className="mr-1" />
              {post.type === "Offer" ? "Request Item" : "Offer Help"}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end text-xs text-gray-500">
            <div>
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <FontAwesomeIcon icon={faShareAlt} className="mr-1" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Form Modal - แสดงโดยตรงไม่ผ่านการยืนยันก่อน */}
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