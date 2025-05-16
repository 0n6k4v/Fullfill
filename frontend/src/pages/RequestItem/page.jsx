"use client";

import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "../../components/Footer";
import ProgressBar from "./components/ProgressBar";
import RequestForm from "./components/RequestForm";

const RequestItemPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    condition: "Good",
    location: "",
    useCurrentLocation: false,
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // File upload state
  const [files, setFiles] = useState([]);
  const [formProgress, setFormProgress] = useState(0);

  // Update form progress
  const updateFormProgress = () => {
    let fieldsCompleted = 0;
    const totalRequiredFields = 3;

    if (formData.itemName) fieldsCompleted++;
    if (formData.category) fieldsCompleted++;
    if (formData.location || formData.useCurrentLocation) fieldsCompleted++;

    const progress = Math.floor((fieldsCompleted / totalRequiredFields) * 100);
    setFormProgress(progress);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <ProgressBar formProgress={formProgress} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <RequestForm 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            files={files}
            setFiles={setFiles}
            updateFormProgress={updateFormProgress}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestItemPage;