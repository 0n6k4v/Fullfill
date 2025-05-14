"use client";

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronUp, faChevronDown, faThLarge, faMapMarkerAlt,
  faSpinner, faMagic, faCloudUploadAlt, faTimes,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox, faStar as fasStar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

const DonationForm = ({ formData, setFormData, previewImages, setPreviewImages, getConditionText, categories }) => {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle condition rating change
  const handleConditionChange = (rating) => {
    setFormData({
      ...formData,
      condition: rating,
    });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category,
    });
    setIsCategoryDropdownOpen(false);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const updatedPhotos = [...formData.photos, ...newFiles].slice(0, 5); // Limit to 5 photos

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });

    // Generate preview URLs
    const newPreviewImages = updatedPhotos.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(newPreviewImages);
  };

  // Remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });

    // Update preview images
    URL.revokeObjectURL(previewImages[index]);
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  // Trigger file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate AI description
  const generateDescription = () => {
    setIsGeneratingDescription(true);

    // Simulate AI processing
    setTimeout(() => {
      const generatedDescription = `This is a ${formData.condition > 3 ? "well-maintained" : "gently used"} ${formData.title || "[item]"} in ${getConditionText(formData.condition)} condition. ${formData.category ? `Perfect for anyone looking for ${formData.category.toLowerCase()} items.` : ""} Local pickup available in ${formData.location || "[your location]"}.`;

      setFormData({
        ...formData,
        description: generatedDescription,
      });

      setIsGeneratingDescription(false);
    }, 1500);
  };

  // Helper function to get correct icon
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'fa-couch': return faCouch;
      case 'fa-tshirt': return faTshirt;
      case 'fa-laptop': return faLaptop;
      case 'fa-blender': return faBlender;
      case 'fa-baby': return faBaby;
      case 'fa-book': return faBook;
      case 'fa-utensils': return faUtensils;
      case 'fa-futbol': return faFutbol;
      case 'fa-home': return faHome;
      case 'fa-box': return faBox;
      default: return faThLarge;
    }
  };

  return (
    <form>
      {/* Item Title */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-gray-700 font-medium mb-2"
        >
          Item Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Wooden Dining Table, Winter Jacket"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          required
        />
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-gray-700 font-medium mb-2"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm !rounded-button whitespace-nowrap cursor-pointer"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            <span className="flex items-center">
              {formData.category ? (
                <>
                  <FontAwesomeIcon 
                    icon={getCategoryIcon(categories.find((c) => c.name === formData.category)?.icon || "fa-th-large")} 
                    className="mr-2 text-blue-500" 
                  />
                  {formData.category}
                </>
              ) : (
                "Select a category"
              )}
            </span>
            <FontAwesomeIcon 
              icon={isCategoryDropdownOpen ? faChevronUp : faChevronDown} 
              className="text-gray-400" 
            />
          </button>
          {isCategoryDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <FontAwesomeIcon 
                    icon={getCategoryIcon(category.icon)} 
                    className="mr-2 text-blue-500 w-5" 
                  />
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Condition Rating */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Condition <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleConditionChange(rating)}
                className="text-2xl focus:outline-none cursor-pointer"
              >
                <FontAwesomeIcon 
                  icon={rating <= formData.condition ? fasStar : farStar} 
                  className={rating <= formData.condition ? "text-amber-400" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>
          <span className="ml-4 text-gray-600">
            {formData.condition > 0
              ? getConditionText(formData.condition)
              : "Select condition"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={generateDescription}
            disabled={isGeneratingDescription}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center !rounded-button whitespace-nowrap cursor-pointer"
          >
            {isGeneratingDescription ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-1" />
                Generating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMagic} className="mr-1" />
                Generate with AI
              </>
            )}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your item's features, condition, and any other relevant details..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={5}
          required
        ></textarea>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            Be specific to help others understand what you're offering
          </span>
          <span>{formData.description.length}/500</span>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label
          htmlFor="location"
          className="block text-gray-700 font-medium mb-2"
        >
          Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Downtown, Seattle"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          />
          <FontAwesomeIcon 
            icon={faMapMarkerAlt} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" 
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          For safety, provide a general area rather than your exact address
        </p>
      </div>

      {/* Photo Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Photos <span className="text-gray-500">(Up to 5)</span>
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <FontAwesomeIcon 
            icon={faCloudUploadAlt} 
            className="text-4xl text-blue-500 mb-3" 
          />
          <p className="text-gray-700 mb-1">
            Drag and drop your photos here
          </p>
          <p className="text-gray-500 text-sm mb-2">
            or click to browse files
          </p>
          <button
            type="button"
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
          >
            Select Photos
          </button>
        </div>

        {/* Preview Images */}
        {previewImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-2">
              Uploaded Photos:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {previewImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default DonationForm;