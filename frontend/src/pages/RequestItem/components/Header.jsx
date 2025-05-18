'use client';

import React from "react";
import Link from "next/link";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 flex items-center"
              aria-label="กลับหน้าหลัก"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              กลับหน้าหลัก
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            ขอรับสิ่งของ
          </h1>
          <div className="w-24" /> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
};

export default Header;