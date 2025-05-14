import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCouch, faTshirt, faLaptop, faBlender, faBaby, 
  faBook, faUtensils, faBox
} from '@fortawesome/free-solid-svg-icons';

const CategorySelection = ({ formData = {}, handleCategorySelect, categories = [], errors = {} }) => {
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'fa-couch': return faCouch;
      case 'fa-tshirt': return faTshirt;
      case 'fa-laptop': return faLaptop;
      case 'fa-blender': return faBlender;
      case 'fa-baby': return faBaby;
      case 'fa-book': return faBook;
      case 'fa-utensils': return faUtensils;
      case 'fa-box': return faBox;
      default: return faBox;
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Select a category <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategorySelect(category.name)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border ${(formData?.category || '') === category.name ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50"} cursor-pointer transition-all`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${(formData?.category || '') === category.name ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            >
              <FontAwesomeIcon icon={getCategoryIcon(category.icon)} className="text-xl" />
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        ))}
      </div>
      {errors?.category && (
        <p className="mt-1 text-red-500 text-sm">{errors.category}</p>
      )}
    </div>
  );
};

export default CategorySelection;