'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faUser,
  faHandHoldingHeart,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import RequestFormModal from '../../../components/RequestFormModal';

const SimilarItems = ({ items = [] }) => {
  // State สำหรับควบคุม Modal แต่ละรายการ
  const [activeRequestItem, setActiveRequestItem] = useState(null);

  // ฟังก์ชันที่ทำงานเมื่อกดปุ่มขอรับ
  const handleRequestClick = (itemId) => {
    setActiveRequestItem(itemId);
  };

  // ฟังก์ชันที่ทำงานเมื่อยกเลิก
  const handleCancel = () => {
    setActiveRequestItem(null);
  };

  // ฟังก์ชันที่ทำงานเมื่อส่งฟอร์ม
  const handleFormSubmit = (formData) => {
    console.log("Form submitted with data:", formData);
    setActiveRequestItem(null);
    alert("คำขอของคุณถูกส่งเรียบร้อยแล้ว!");
  };

  if (!items || items.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          รายการที่คล้ายกัน
        </h2>
        <p className="text-gray-500">No similar items available</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        รายการที่คล้ายกัน
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          // กำหนดไอคอนและสีตามประเภทโพสต์
          const isDonation = item.type === "Donation" || item.type === "การบริจาค";
          const buttonIcon = isDonation ? faHandHoldingHeart : faHandshake;
          const buttonColor = isDonation 
            ? 'bg-amber-500 hover:bg-amber-600' 
            : 'bg-green-500 hover:bg-green-600';
          const buttonText = isDonation ? "ขอรับ" : "ช่วยเหลือ";
          
          // กำหนดสีและข้อความสำหรับ tag ประเภท
          const tagClass = isDonation 
            ? "bg-green-100 text-green-800" 
            : "bg-blue-100 text-blue-800";
          
          return (
            <React.Fragment key={item.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagClass}`}>
                      {item.type}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
                    <FontAwesomeIcon icon={faHeart} className="text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-1" />
                    <span>{item.location} • {item.distance}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <FontAwesomeIcon icon={faUser} className="text-xs text-gray-600" />
                      </div>
                      <span className="text-xs text-gray-600">
                        {item.postedTime}
                      </span>
                    </div>
                    
                    {/* ปุ่มที่ปรับเปลี่ยนตามประเภท Donation หรือ Request */}
                    <button 
                      onClick={() => handleRequestClick(item.id)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${buttonColor} focus:outline-none !rounded-button whitespace-nowrap`}
                    >
                      <FontAwesomeIcon icon={buttonIcon} className="mr-1" />
                      {buttonText}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* แสดง Modal เมื่อคลิกปุ่ม */}
              {activeRequestItem === item.id && (
                <RequestFormModal
                  post={item}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarItems;