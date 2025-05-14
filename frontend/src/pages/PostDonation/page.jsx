"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DonationForm from "./components/DonationForm";
import DonationPreview from "./components/DonationPreview";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PostDonationPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: 0,
    description: "",
    location: "",
    photos: [],
  });

  // UI state
  const [previewImages, setPreviewImages] = useState([]);

  // Get text representation of condition
  const getConditionText = (rating) => {
    switch (rating) {
      case 1: return "poor";
      case 2: return "fair";
      case 3: return "good";
      case 4: return "very good";
      case 5: return "excellent";
      default: return "unspecified";
    }
  };

  // Categories with icons
  const categories = [
    { name: "Furniture", icon: "fa-couch" },
    { name: "Clothing", icon: "fa-tshirt" },
    { name: "Electronics", icon: "fa-laptop" },
    { name: "Appliances", icon: "fa-blender" },
    { name: "Kids & Toys", icon: "fa-baby" },
    { name: "Books", icon: "fa-book" },
    { name: "Kitchen", icon: "fa-utensils" },
    { name: "Sports & Outdoors", icon: "fa-futbol" },
    { name: "Home Decor", icon: "fa-home" },
    { name: "Other", icon: "fa-box" },
  ];

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Donations
            </a>
          </div>

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