"use client";

import React from 'react';
import Header from '../../../pages/Home/components/Header';
import Footer from '../../../pages/Home/components/Footer';

export default function ItemLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
