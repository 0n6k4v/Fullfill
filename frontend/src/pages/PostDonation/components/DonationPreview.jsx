'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, faStar, faMapMarkerAlt, faBookmark, 
  faShareAlt, faImage, faPaperPlane, faSave, faThLarge,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox,
  faChevronLeft, faChevronRight, faClock, faUser, faSpinner, faTimes
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const DonationPreview = ({ formData = {}, previewImages = [], categories, onClose = () => {} }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to get correct icon
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'fa-couch': return faCouch;
      case 'fa-tshirt': return faTshirt;
      case 'fa-laptop': return faLaptop;
      case 'fa-blender': return faBlender;
      case 'fa-baby': return faBaby;
      case 'fa-book': return faBook;
      case 'fa-utensils': return faUtensils;
      case 'fa-futbol': return faFutbol;
      case 'fa-home': return faHome;
      case 'fa-box': return faBox;
      default: return faThLarge;
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? previewImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === previewImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getConditionText = (condition) => {
    const conditions = {
      'Poor': 'สภาพไม่ดี',
      'Fair': 'สภาพพอใช้',
      'Good': 'สภาพดี',
      'Like_New': 'เหมือนใหม่',
      'New': 'ใหม่'
    };
    return conditions[condition] || condition;
  };

  const getConditionColor = (condition) => {
    const colors = {
      'Poor': 'bg-red-100 text-red-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Good': 'bg-green-100 text-green-800',
      'Like_New': 'bg-blue-100 text-blue-800',
      'New': 'bg-purple-100 text-purple-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  if (!previewImages || previewImages.length === 0) {
    return (
      <div className="md:w-1/2 relative">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ส่วนหัว */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">ตัวอย่างการแสดงผล</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="ปิด"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* ส่วนรูปภาพ */}
      <div className="relative h-64 bg-gray-100">
        {previewImages.length > 0 ? (
          <>
            <Image
              src={previewImages[currentImageIndex]}
              alt={`รูปภาพ ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            {previewImages.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="รูปก่อนหน้า"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="รูปถัดไป"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin text-4xl" />
          </div>
        )}
      </div>

      {/* ส่วนรายละเอียด */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{formData.title || 'ชื่อสิ่งของ'}</h3>
          {formData.condition && (
            <span className={`px-2 py-1 rounded-full text-sm ${getConditionColor(formData.condition)}`}>
              {getConditionText(formData.condition)}
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon 
            icon={formData.category ? getCategoryIcon(categories.find((c) => c.name === formData.category)?.icon) : faTag} 
            className="mr-2 text-blue-500" 
          />
          <span>{formData.category || "Category"}</span>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2" />
            <span>{formData.location || 'สถานที่...'}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="w-4 mr-2" />
            <span>โพสต์เมื่อ {new Date().toLocaleDateString('th-TH')}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="w-4 mr-2" />
            <span>โพสต์โดย {formData.postedBy || 'ผู้ใช้'}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {formData.description ||
            "Item description will appear here..."}
        </p>

        <div className="flex justify-between">
          <span className="text-green-500 font-medium text-sm">
            Available for donation
          </span>
          <div className="flex space-x-2">
            <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
            <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4">
          This is how your donation will appear to others in the community.
        </p>
        <div className="flex flex-col space-y-3">
          <button className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors font-medium shadow-md !rounded-button whitespace-nowrap cursor-pointer">
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Submit Donation
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium !rounded-button whitespace-nowrap cursor-pointer">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationPreview;