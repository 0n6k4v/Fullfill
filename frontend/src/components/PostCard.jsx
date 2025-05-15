'use client';

import React, { useState } from 'react';
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
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import RequestFormModal from './RequestFormModal';

const PostCard = ({ post, viewMode }) => {
  // State เพื่อควบคุมการแสดง Modal
  const [showRequestForm, setShowRequestForm] = useState(false);

  // กำหนดไอคอนและสีตามประเภทโพสต์
  const buttonIcon = post.type === "Donation" ? faHandshake : faHandHoldingHeart;
  const buttonColor = post.type === "Donation" 
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
    // ทำงานกับข้อมูลที่ส่งจากฟอร์ม
    console.log("Form submitted with data:", formData);
    // ปิด Modal
    setShowRequestForm(false);
    // แสดงข้อความยืนยัน หรือทำงานอื่นๆ เช่น redirect
    alert("คำขอของคุณถูกส่งเรียบร้อยแล้ว!");
  };

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
                post.type === "Donation"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {post.type}
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
                  {post.location} • {post.distance}
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {post.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Condition: {post.condition}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Qty: {post.quantity}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 text-xl" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {post.user}
                </p>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>

            <button 
              onClick={handleRequestClick}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${buttonColor} focus:outline-none !rounded-button whitespace-nowrap`}
            >
              <FontAwesomeIcon icon={buttonIcon} className="mr-1" />
              {post.type === "Donation" ? "Request Item" : "Offer Help"}
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