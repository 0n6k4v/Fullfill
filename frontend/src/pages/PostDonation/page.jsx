"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "../../components/Footer";
import DonationForm from "./components/DonationForm";
import DonationPreview from "./components/DonationPreview";

const PostDonationPage = () => {  
  // Form state ปรับโครงสร้างให้ตรงกับ API
  const [formData, setFormData] = useState({
    title: "",               // เทียบกับ name ใน API
    category: "",            // เลือกจาก enum ใน API
    condition: "",           // เปลี่ยนเป็นค่า string จาก enum แทนตัวเลข
    description: "",
    location: "",
    photos: [],
    type: "Offer",           // เพิ่ม default เป็น "Offer"
    lat: null,               // เพิ่มสำหรับพิกัด
    lon: null,               // เพิ่มสำหรับพิกัด
  });

  // UI state
  const [previewImages, setPreviewImages] = useState([]);

  // Categories แก้ให้ตรงกับค่าใน API (lowercase และตัดรายการที่ไม่มีใน API)
  const categories = [
    { name: "furniture", icon: "fa-couch" },
    { name: "clothing", icon: "fa-tshirt" },
    { name: "electronics", icon: "fa-laptop" },
    { name: "appliances", icon: "fa-blender" },
    { name: "kids_toys", icon: "fa-baby" },
    { name: "books", icon: "fa-book" },
    { name: "kitchen", icon: "fa-utensils" },
    { name: "other", icon: "fa-box" },
  ];

  // แก้ไขฟังก์ชัน getConditionText ให้ตรงกับค่า enum ในฐานข้อมูล
  const getConditionText = (conditionValue) => {
    const conditionMap = {
      "Poor": "Poor condition with noticeable wear",
      "Fair": "Fair condition with some wear",
      "Good": "Good condition with minimal wear",
      "Like_New": "Like new condition, barely used",
      "New": "New condition, unused"
    };
    return conditionMap[conditionValue] || "Select condition";
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div>
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Post a Donation
            </h1>
            <p className="text-gray-600">
              Share items you no longer need with those who can use them
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6">
              <DonationForm 
                formData={formData}
                setFormData={setFormData}
                previewImages={previewImages}
                setPreviewImages={setPreviewImages}
                getConditionText={getConditionText}
                categories={categories}
              />
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/3">
              <DonationPreview 
                formData={formData}
                previewImages={previewImages}
                categories={categories}
                getConditionText={getConditionText}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDonationPage;