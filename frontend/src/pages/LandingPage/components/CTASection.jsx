'use client'

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../../context/AuthContext";

const CTASection = () => {
  // ใช้ try-catch เพื่อป้องกันกรณีที่ AuthProvider ไม่มีอยู่
  let isAuthenticated = false;
  try {
    const { isAuthenticated: auth } = useAuth();
    isAuthenticated = auth;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  return (
    <section className="bg-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            พร้อมที่จะเริ่มต้นแบ่งปัน?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            เข้าร่วมกับเราได้เลยวันนี้
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/PostDonation"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
              aria-label="เริ่มต้นบริจาค"
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" />
              เริ่มต้นบริจาค
            </Link>
            <Link
              href="/Post"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition-colors"
              aria-label="ค้นหาสิ่งของ"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              ค้นหาสิ่งของ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;