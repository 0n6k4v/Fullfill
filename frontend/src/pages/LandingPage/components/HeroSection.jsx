'use client';

import React from "react";
import Link from "next/link"; // เพิ่ม import Link จาก next/link
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandHoldingHeart, faSearch } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">แบ่งปันความสุข</span>
            <span className="block">สร้างรอยยิ้มให้สังคม</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            แพลตฟอร์มสำหรับการบริจาคสิ่งของที่ไม่ใช้แล้ว ให้กับผู้ที่ต้องการ
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/Post"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              aria-label="เริ่มต้นบริจาค"
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" />
              เริ่มต้นบริจาค
            </Link>
            <Link
              href="/RequestItem"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
              aria-label="ค้นหาสิ่งของ"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              ค้นหาสิ่งของ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;