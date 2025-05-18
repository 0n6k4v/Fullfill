import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, faStar, faMapMarkerAlt, faBookmark, 
  faShareAlt, faImage, faPaperPlane, faSave, faThLarge,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox,
  faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const DonationPreview = ({ formData, previewImages, categories, getConditionText }) => {
  const [currentImage, setCurrentImage] = useState(0);

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

  if (!previewImages || previewImages.length === 0) {
    return (
      <div className="md:w-1/2 relative">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Preview
      </h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="relative h-48 bg-gray-100">
          <div className="h-96 relative">
            <img
              src={previewImages[currentImage]}
              alt="Item preview"
              className="w-full h-full object-cover object-top"
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white cursor-pointer !rounded-button whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {previewImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2.5 h-2.5 rounded-full ${currentImage === index ? "bg-indigo-600" : "bg-white/70"} cursor-pointer !rounded-button whitespace-nowrap`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {formData.title || "Item Title"}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FontAwesomeIcon 
              icon={formData.category ? getCategoryIcon(categories.find((c) => c.name === formData.category)?.icon) : faTag} 
              className="mr-2 text-blue-500" 
            />
            <span>{formData.category || "Category"}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <FontAwesomeIcon 
              icon={faStar} 
              className="mr-2 text-amber-400" 
            />
            <span>
              Condition:{" "}
              {formData.condition > 0
                ? getConditionText(formData.condition)
                : "Not specified"}
            </span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <FontAwesomeIcon 
              icon={faMapMarkerAlt} 
              className="mr-2 text-red-500" 
            />
            <span>{formData.location || "Location"}</span>
          </div>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {formData.description ||
              "Item description will appear here..."}
          </p>
          <div className="flex justify-between">
            <span className="text-green-500 font-medium text-sm">
              Available for donation
            </span>
            <div className="flex space-x-2">
              <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <FontAwesomeIcon icon={faBookmark} />
              </button>
              <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4">
          This is how your donation will appear to others in the community.
        </p>
        <div className="flex flex-col space-y-3">
          <button className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors font-medium shadow-md !rounded-button whitespace-nowrap cursor-pointer">
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Submit Donation
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium !rounded-button whitespace-nowrap cursor-pointer">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationPreview;