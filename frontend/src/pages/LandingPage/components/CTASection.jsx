'use client'

import React from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faUserPlus, faHandHoldingHeart, faSearch } from '@fortawesome/free-solid-svg-icons';

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  const getDonationUrl = () => {
    return isAuthenticated() ? '/PostDonation' : '/Auth';
  };

  return (
    <div className="bg-indigo-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">พร้อมที่จะเริ่มต้นแบ่งปัน?</span>
          <span className="block text-indigo-200">เข้าร่วมกับเราได้เลยวันนี้</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              href="/Post"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              aria-label="เริ่มต้นบริจาค"
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" />
              เริ่มต้นบริจาค
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              href="/RequestItem"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400"
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

export default CTASection;