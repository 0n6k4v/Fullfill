"use client"

import React, { useState } from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, faCouch, faTshirt, faLaptop, faBlender, faBaby, 
  faBook, faUtensils, faMapMarkerAlt, faSearch, faFilter, faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const SearchAndFilter = ({ onViewModeChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [viewMode, setViewMode] = useState("grid");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Categories with icons
  const categories = [
    { name: "All Categories", icon: faThLarge },
    { name: "Furniture", icon: faCouch },
    { name: "Clothing", icon: faTshirt },
    { name: "Electronics", icon: faLaptop },
    { name: "Appliances", icon: faBlender },
    { name: "Kids & Toys", icon: faBaby },
    { name: "Books", icon: faBook },
    { name: "Kitchen", icon: faUtensils },
  ];

  // Locations
  const locations = [
    "All Locations",
    "Downtown, Seattle",
    "Capitol Hill, Seattle",
    "Ballard, Seattle",
    "Fremont, Seattle",
    "Queen Anne, Seattle",
    "University District, Seattle",
  ];

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.icon : faThLarge;
  };

  return (
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="w-full md:w-2/3 relative mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search for donations or requests..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer ${viewMode === "grid" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setViewMode("grid")}
              >
                <FontAwesomeIcon icon={faThLarge} className="mr-2" />
                Grid View
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer ${viewMode === "map" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setViewMode("map")}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Map View
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/3">
              <button
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
              >
                <span className="flex items-center">
                  <FontAwesomeIcon 
                    icon={getCategoryIcon(selectedCategory)} 
                    className="mr-2 text-blue-500" 
                  />
                  {selectedCategory}
                </span>
                <FontAwesomeIcon 
                  icon={isCategoryDropdownOpen ? faChevronUp : faChevronDown} 
                  className="text-gray-400" 
                />
              </button>
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      <FontAwesomeIcon 
                        icon={category.icon} 
                        className="mr-2 text-blue-500 w-5" 
                      />
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full md:w-1/3">
              <button
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
              >
                <span className="flex items-center">
                  <FontAwesomeIcon 
                    icon={faMapMarkerAlt} 
                    className="mr-2 text-red-500" 
                  />
                  {selectedLocation}
                </span>
                <FontAwesomeIcon 
                  icon={isLocationDropdownOpen ? faChevronUp : faChevronDown} 
                  className="text-gray-400" 
                />
              </button>
              {isLocationDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {locations.map((location) => (
                    <div
                      key={location}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationDropdownOpen(false);
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <div className="flex space-x-2">
                <button className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon 
                    icon={faFilter} 
                    className="mr-2 text-gray-500" 
                  />
                  More Filters
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="mr-2" 
                  />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default SearchAndFilter;