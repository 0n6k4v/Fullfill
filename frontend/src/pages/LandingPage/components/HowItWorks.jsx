'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faSearch, faMapMarkerAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const HowItWorks = () => {
  const steps = [
    {
      icon: faHandHoldingHeart,
      title: 'โพสต์สิ่งของ',
      description: 'แจ้งรายละเอียดสิ่งของที่ต้องการบริจาค พร้อมรูปภาพและสภาพของสิ่งของ'
    },
    {
      icon: faSearch,
      title: 'ค้นหาผู้รับ',
      description: 'ระบบจะช่วยจับคู่สิ่งของของคุณกับผู้ที่กำลังมองหาสิ่งของนั้นๆ'
    },
    {
      icon: faMapMarkerAlt,
      title: 'เลือกสถานที่',
      description: 'กำหนดสถานที่สำหรับการส่งมอบสิ่งของที่สะดวกสำหรับทั้งสองฝ่าย'
    },
    {
      icon: faCheckCircle,
      title: 'ส่งมอบสิ่งของ',
      description: 'พบปะและส่งมอบสิ่งของให้กับผู้รับที่คุณเลือก'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            วิธีการใช้งาน
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            เพียงไม่กี่ขั้นตอน คุณก็สามารถแบ่งปันสิ่งของที่ไม่ใช้แล้วให้กับผู้ที่ต้องการได้
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600">
                    <FontAwesomeIcon icon={step.icon} className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="h-0.5 w-16 bg-gray-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;