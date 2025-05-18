'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const testimonials = [
    {
      content: 'แพลตฟอร์มนี้ช่วยให้ผมสามารถบริจาคสิ่งของที่ไม่ใช้แล้วให้กับผู้ที่ต้องการได้อย่างง่ายดาย',
      author: 'คุณสมชาย',
      role: 'ผู้บริจาค'
    },
    {
      content: 'ได้รับความช่วยเหลือมากมายจากผู้ใจดีผ่านแพลตฟอร์มนี้ ทำให้ชีวิตของครอบครัวเราดีขึ้น',
      author: 'คุณสมหญิง',
      role: 'ผู้รับบริจาค'
    },
    {
      content: 'ระบบใช้งานง่าย สะดวก และปลอดภัย ทำให้การบริจาคเป็นเรื่องที่สนุกและมีความหมาย',
      author: 'คุณสมศักดิ์',
      role: 'ผู้บริจาค'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            เสียงจากผู้ใช้งาน
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            ความประทับใจจากผู้ใช้งานแพลตฟอร์มของเรา
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-indigo-50 rounded-lg p-6 relative">
                <div className="absolute top-4 left-4 text-indigo-200">
                  <FontAwesomeIcon icon={faQuoteLeft} className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="relative">
                  <p className="text-gray-600 italic mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="mt-4">
                    <p className="text-base font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;