'use client'

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronUp, faChevronDown, faThLarge, faMapMarkerAlt,
  faSpinner, faLightbulb, faCloudUploadAlt, faTimes,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox, faStar as fasStar,
  faMapLocation, faCheckCircle, faClock
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../context/AuthContext';
import api from "@/services/api";
import { useRouter } from 'next/navigation';
import ItemNameInput from './ItemNameInput';
import CategorySelection from './CategorySelection';
import ConditionSelection from './ConditionSelection';
import DescriptionInput from './DescriptionInput';
import LocationInput from './LocationInput';
import PhotoUploader from './PhotoUploader';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'), 
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">กำลังโหลดแผนที่...</div>
  }
);

const RequestForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    location: '',
    photos: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ใช้ try-catch เพื่อป้องกันกรณีที่ AuthProvider ไม่มีอยู่
  let user = null;
  let isAuthenticated = () => false;
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isAuthenticated()) {
        router.push('/Auth');
        return;
      }

      // สร้าง FormData object
      const formDataToSend = new FormData();
      
      // เพิ่มรูปภาพ
      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((file) => {
          formDataToSend.append('images', file);
        });
      }

      // เพิ่มข้อมูลอื่นๆ
      const itemData = {
        name: formData.title,
        category: formData.category,
        type: "Request",
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        uploaded_by: user?.id
      };

      formDataToSend.append('item_data', JSON.stringify(itemData));

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/items/with-images', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      // รีเซ็ตฟอร์มและ redirect
      setFormData({
        title: '',
        category: '',
        condition: '',
        description: '',
        location: '',
        photos: []
      });
      router.push('/');
      
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ขอรับสิ่งของ
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <ItemNameInput
          value={formData.title}
          onChange={handleChange}
        />

        <CategorySelection
          value={formData.category}
          onChange={handleChange}
        />

        <ConditionSelection
          value={formData.condition}
          onChange={handleChange}
        />

        <DescriptionInput
          value={formData.description}
          onChange={handleChange}
        />

        <LocationInput
          value={formData.location}
          onChange={handleChange}
        />

        <PhotoUploader
          photos={formData.photos}
          onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                กำลังส่ง...
              </>
            ) : (
              'ส่งคำขอ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;