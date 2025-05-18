'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

const ImageGallery = ({ images = [], type = 'Donation' }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="md:w-1/2 relative">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="md:w-1/2 relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {type}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleFavorite}
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer !rounded-button"
        >
          <FontAwesomeIcon 
            icon={isFavorite ? fasHeart : farHeart} 
            className={isFavorite ? "text-red-500" : "text-gray-600"} 
          />
        </button>
      </div>
      <div className="h-96 relative">
        <img
          src={images[currentImage]}
          alt="รูปภาพสินค้า"
          className="w-full h-full object-cover object-top"
        />
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white cursor-pointer !rounded-button whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white cursor-pointer !rounded-button whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2.5 h-2.5 rounded-full ${currentImage === index ? "bg-indigo-600" : "bg-white/70"} cursor-pointer !rounded-button whitespace-nowrap`}
            ></button>
          ))}
        </div>
      </div>
      <div className="flex p-2 border-t">
        {images.map((img, index) => (
          <div
            key={index}
            className={`w-1/3 p-1 cursor-pointer ${currentImage === index ? "ring-2 ring-indigo-600" : ""}`}
            onClick={() => setCurrentImage(index)}
          >
            <img
              src={img}
              alt={`รูปภาพสินค้า ${index + 1}`}
              className="w-full h-20 object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;