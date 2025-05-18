'use client'

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faGift, faUsers } from '@fortawesome/free-solid-svg-icons';

const CTASection = () => {
  // ใช้ try-catch เพื่อป้องกันกรณีที่ AuthProvider ไม่มีอยู่
  let isAuthenticated = false;
  try {
    const { useAuth } = require('../../../context/AuthContext');
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            มาร่วมเป็นส่วนหนึ่งของการแบ่งปัน
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ร่วมสร้างสังคมแห่งการแบ่งปันด้วยการบริจาคสิ่งของที่ไม่ใช้แล้ว หรือขอรับสิ่งของที่คุณต้องการ
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-4">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">บริจาคสิ่งของ</h3>
            <p className="text-gray-600 mb-4">
              บริจาคสิ่งของที่ไม่ใช้แล้วของคุณ เพื่อให้ผู้อื่นได้ใช้ประโยชน์
            </p>
            <Link
              href="/PostDonation"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              เริ่มบริจาค
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-4">
              <FontAwesomeIcon icon={faGift} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ขอรับสิ่งของ</h3>
            <p className="text-gray-600 mb-4">
              ขอรับสิ่งของที่คุณต้องการจากผู้บริจาคใจดี
            </p>
            <Link
              href="/RequestItem"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              ขอรับสิ่งของ
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-blue-600 mb-4">
              <FontAwesomeIcon icon={faUsers} className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">เข้าร่วมชุมชน</h3>
            <p className="text-gray-600 mb-4">
              สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์พิเศษและติดตามการบริจาคของคุณ
            </p>
            <Link
              href={isAuthenticated ? "/Dashboard" : "/Auth"}
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              {isAuthenticated ? 'ไปที่แดชบอร์ด' : 'สมัครสมาชิก'}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;