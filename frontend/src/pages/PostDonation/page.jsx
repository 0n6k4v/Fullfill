"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "../../components/Footer";
import DonationForm from "./components/DonationForm";
import DonationPreview from "./components/DonationPreview";
import { useRouter } from 'next/navigation';

const PostDonationPage = () => {  
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    description: "",
    location: "",
    photos: [],
    type: "Offer",
    lat: null,
    lon: null,
  });

  const [previewImages, setPreviewImages] = useState([]);

  let isAuthenticated = false;
  try {
    const { useAuth } = require('../../context/AuthContext');
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.log('AuthProvider not available');
  }

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/Auth');
    }
  }, [isAuthenticated, router]);

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