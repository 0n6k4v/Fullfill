'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'),
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">กำลังโหลดแผนที่...</div>
  }
);

const LocationInput = ({ value, onChange }) => {
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const handleLocationSelect = (locationData) => {
    const { lat, lng, addressData } = locationData;
    setCoordinates({ lat, lng });
    
    if (addressData) {
      const locationText = addressData.placeName 
        ? `${addressData.placeName}, ${addressData.road || ''}`
        : `${addressData.subdistrict}, ${addressData.district}, ${addressData.province}`;
      
      onChange({ target: { name: 'location', value: locationText } });
    }
    
    setShowMap(false);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
        สถานที่
      </label>
      <div className="relative">
        <input
          type="text"
          id="location"
          name="location"
          value={value}
          onChange={onChange}
          placeholder="ระบุสถานที่ที่คุณต้องการรับสิ่งของ"
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
          required
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700"
        >
          เลือกบนแผนที่
        </button>
      </div>
      <p className="text-xs text-gray-500">
        ระบุสถานที่ที่คุณต้องการรับสิ่งของ เพื่อให้ผู้บริจาคทราบว่าต้องส่งมอบที่ไหน
      </p>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">เลือกตำแหน่งบนแผนที่</h3>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ปิด
              </button>
            </div>
            <div className="p-4">
              <LeafletMap onSelectLocation={handleLocationSelect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationInput;