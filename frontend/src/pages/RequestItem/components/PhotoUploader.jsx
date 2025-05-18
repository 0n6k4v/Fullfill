'use client';

import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const PhotoUploader = ({ photos = [], onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsUploading(true);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    onChange([...photos, ...newFiles]);
    setIsUploading(false);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onChange(newPhotos);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        รูปภาพ
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="text-center">
          <FontAwesomeIcon
            icon={isUploading ? faSpinner : faCloudUploadAlt}
            className={`w-8 h-8 mx-auto mb-2 ${
              isUploading ? 'text-blue-500 animate-spin' : 'text-gray-400'
            }`}
          />
          <p className="text-sm text-gray-600">
            {isUploading ? 'กำลังอัปโหลด...' : 'ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            รองรับไฟล์ JPG, PNG ขนาดสูงสุด 5MB
          </p>
        </div>

        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`รูปภาพ ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="ลบรูปภาพ"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        สามารถอัปโหลดได้สูงสุด 5 รูป
      </p>
    </div>
  );
};

export default PhotoUploader;