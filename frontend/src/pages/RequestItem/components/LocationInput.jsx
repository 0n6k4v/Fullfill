import React from "react";

const LocationInput = ({ formData = {}, handleInputChange, handleLocationToggle, errors = {} }) => {
  return (
    <div className="mb-8">
      <label
        htmlFor="location"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Your location <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center mb-2">
        <button
          type="button"
          onClick={handleLocationToggle}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${formData?.useCurrentLocation ? "bg-blue-600" : "bg-gray-200"} !rounded-button whitespace-nowrap cursor-pointer`}
        >
          <span
            className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${formData?.useCurrentLocation ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <span className="ml-2 text-sm text-gray-700">
          Use my current location
        </span>
      </div>
      {!formData?.useCurrentLocation && (
        <input
          type="text"
          id="location"
          name="location"
          value={formData?.location || ""}
          onChange={handleInputChange}
          placeholder="Enter your neighborhood, city, or zip code"
          className={`w-full px-4 py-3 rounded-lg border ${errors?.location ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base`}
          disabled={formData?.useCurrentLocation}
        />
      )}
      {errors?.location && (
        <p className="mt-1 text-red-500 text-sm">{errors.location}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        We'll use this to match you with nearby donations.
      </p>
    </div>
  );
};

export default LocationInput;