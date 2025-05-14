'use client'

import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronUp, faChevronDown, faCheckCircle, faClock,
  faLightbulb // เพิ่ม import icon lightbulb
} from '@fortawesome/free-solid-svg-icons';
import ItemNameInput from "./ItemNameInput";
import CategorySelection from "./CategorySelection";
import DescriptionInput from "./DescriptionInput";
import ConditionSelection from "./ConditionSelection";
import LocationInput from "./LocationInput";
import PhotoUploader from "./PhotoUploader";

const RequestForm = ({ 
  formData, 
  setFormData, 
  setErrors, 
  errors, 
  files, 
  setFiles,
  updateFormProgress
}) => {
  const [showTips, setShowTips] = useState(true);
  
  // Categories with icons
  const categories = [
    { name: "Furniture", icon: "fa-couch" },
    { name: "Clothing", icon: "fa-tshirt" },
    { name: "Electronics", icon: "fa-laptop" },
    { name: "Appliances", icon: "fa-blender" },
    { name: "Kids & Toys", icon: "fa-baby" },
    { name: "Books", icon: "fa-book" },
    { name: "Kitchen", icon: "fa-utensils" },
    { name: "Other", icon: "fa-box" },
  ];

  // Condition options
  const conditionOptions = ["New", "Like New", "Good", "Fair"];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Update form progress
    updateFormProgress();
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category,
    });

    // Clear error when field is updated
    if (errors.category) {
      setErrors({
        ...errors,
        category: "",
      });
    }

    // Update form progress
    updateFormProgress();
  };

  // Handle condition selection
  const handleConditionSelect = (condition) => {
    setFormData({
      ...formData,
      condition,
    });

    // Update form progress
    updateFormProgress();
  };

  // Handle location toggle
  const handleLocationToggle = () => {
    setFormData({
      ...formData,
      useCurrentLocation: !formData.useCurrentLocation,
      location: formData.useCurrentLocation ? "" : "Using current location",
    });

    // Clear error when field is updated
    if (errors.location) {
      setErrors({
        ...errors,
        location: "",
      });
    }

    // Update form progress
    updateFormProgress();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.location && !formData.useCurrentLocation) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log("Form submitted:", formData);
      console.log("Files:", files);

      // Here you would typically send the data to your backend
      alert("Request submitted successfully!");
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ItemNameInput 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <CategorySelection 
        formData={formData} 
        handleCategorySelect={handleCategorySelect} 
        categories={categories} 
        errors={errors} 
      />
      
      <DescriptionInput 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />
      
      <ConditionSelection 
        formData={formData} 
        handleConditionSelect={handleConditionSelect} 
        conditionOptions={conditionOptions} 
      />
      
      <LocationInput 
        formData={formData} 
        handleInputChange={handleInputChange} 
        handleLocationToggle={handleLocationToggle} 
        errors={errors} 
      />
      
      <PhotoUploader 
        files={files}
        setFiles={setFiles}
        updateFormProgress={updateFormProgress}
      />

      {/* Tips Section */}
      <div className="mb-10 bg-blue-50 rounded-lg overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 bg-blue-100 cursor-pointer"
          onClick={() => setShowTips(!showTips)}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mr-2" />
            <h3 className="font-medium text-blue-800">
              Tips for a successful request
            </h3>
          </div>
          <FontAwesomeIcon icon={showTips ? faChevronUp : faChevronDown} className="text-blue-800" />
        </div>

        {showTips && (
          <div className="p-4">
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>
                  <strong>Be specific:</strong> Clearly describe the item
                  you need, including size, color, and other important
                  details.
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>
                  <strong>Add photos:</strong> Include reference images to
                  help donors understand exactly what you're looking for.
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                <span>
                  <strong>Explain why:</strong> Sharing why you need the
                  item can help motivate potential donors.
                </span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="text-amber-500 mt-1 mr-2" />
                <span>
                  <strong>Expected timeframes:</strong> Most requests are
                  matched within 1-2 weeks, but this can vary based on
                  item availability.
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md !rounded-button whitespace-nowrap cursor-pointer"
          >
            Submit Request
          </button>
        </div>
      </div>
    </form>
  );
};

export default RequestForm;