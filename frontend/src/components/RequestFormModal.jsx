'use client';

import React, { useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faTimes,
  faMapMarkedAlt,
  faLocationArrow,
  faTruck
} from '@fortawesome/free-solid-svg-icons';

const RequestFormModal = ({ post, onSubmit, onCancel }) => {
  // ข้อมูลตัวอย่างสำหรับ user (จริงๆ แล้วควรมาจาก context หรือ redux)
  const mockUser = {
    name: 'John Doe',
    phone: '088-123-4567',
    email: 'john.doe@example.com',
    savedAddresses: [
      { id: 1, label: 'บ้าน', address: '123 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110' },
      { id: 2, label: 'ที่ทำงาน', address: '456 อาคารมหานคร ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500' }
    ]
  };

  // State สำหรับฟอร์ม
  const [formData, setFormData] = useState({
    name: mockUser.name,
    phone: mockUser.phone,
    email: mockUser.email,
    addressType: 'saved',
    selectedAddressId: mockUser.savedAddresses[0]?.id || '',
    newAddress: '',
    pickupMethod: 'self',
    reason: '',
    preferredTime: ''
  });

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // ป้องกันการ bubble event จาก overlay สู่ modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      {/* Overlay - ปรับให้คลิกแล้วทำงาน */}
      <div 
        className="fixed inset-0 bg-opacity-75 backdrop-blur-[5px] transition-opacity" 
        onClick={onCancel}
      ></div>

      {/* Modal content - เพิ่ม z-index และ relative positioning ให้อยู่เหนือ overlay */}
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full relative z-50"
        onClick={handleModalClick}
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {post.type === "Donation" ? "แบบฟอร์มขอรับบริจาค" : "แบบฟอร์มเสนอความช่วยเหลือ"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                กรุณากรอกข้อมูลเพื่อดำเนินการต่อ
              </p>
            </div>

            {/* ข้อมูลส่วนตัว */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">ข้อมูลส่วนตัว</h4>
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ที่อยู่จัดส่ง */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
                ที่อยู่จัดส่ง
              </h4>
              
              <div className="mt-2 mb-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    id="useSavedAddress"
                    value="saved"
                    checked={formData.addressType === 'saved'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="useSavedAddress" className="text-sm text-gray-700">
                    เลือกจากที่อยู่ที่บันทึกไว้
                  </label>
                </div>
                
                {formData.addressType === 'saved' && (
                  <div className="mt-2 ml-6">
                    <select
                      name="selectedAddressId"
                      value={formData.selectedAddressId}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {mockUser.savedAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label} - {addr.address}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    id="useNewAddress"
                    value="new"
                    checked={formData.addressType === 'new'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="useNewAddress" className="text-sm text-gray-700">
                    เพิ่มที่อยู่ใหม่
                  </label>
                </div>
                
                {formData.addressType === 'new' && (
                  <div className="mt-2 ml-6">
                    <textarea
                      name="newAddress"
                      rows="3"
                      value={formData.newAddress}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="กรอกที่อยู่ใหม่ของคุณ"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            {/* วิธีการรับของ */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">วิธีการรับของ</h4>
              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="pickupMethod"
                    id="selfPickup"
                    value="self"
                    checked={formData.pickupMethod === 'self'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="selfPickup" className="text-sm text-gray-700">
                    <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                    รับด้วยตนเอง
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="pickupMethod"
                    id="deliveryRequest"
                    value="delivery"
                    checked={formData.pickupMethod === 'delivery'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="deliveryRequest" className="text-sm text-gray-700">
                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                    ขอความช่วยเหลือในการจัดส่ง
                  </label>
                </div>
              </div>
            </div>

            {/* เหตุผลและเวลารับของ */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  เหตุผลในการขอรับบริจาค (ไม่บังคับ)
                </label>
                <textarea
                  name="reason"
                  id="reason"
                  rows="2"
                  value={formData.reason}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                  ช่วงเวลาที่สะดวกในการรับของ
                </label>
                <select
                  name="preferredTime"
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">กรุณาเลือกช่วงเวลา</option>
                  <option value="morning">เช้า (9:00 - 12:00)</option>
                  <option value="afternoon">บ่าย (13:00 - 17:00)</option>
                  <option value="evening">เย็น (17:00 - 20:00)</option>
                  <option value="weekend">วันหยุดสุดสัปดาห์</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {post.type === "Donation" ? "ส่งคำขอ" : "เสนอความช่วยเหลือ"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestFormModal;