import React from "react";

const LocationInput = ({ formData = {}, handleInputChange = () => {}, handleLocationToggle = () => {}, errors = {} }) => {
  // Ensure formData and errors are objects
  const safeFormData = typeof formData === 'object' && formData !== null ? formData : {};
  const safeErrors = typeof errors === 'object' && errors !== null ? errors : {};

  return (
    <div className="mb-8">
      <label
        htmlFor="location"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        ที่ตั้งของคุณ <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center mb-2">
        <button
          type="button"
          onClick={handleLocationToggle}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${safeFormData.useCurrentLocation ? "bg-blue-600" : "bg-gray-200"} !rounded-button whitespace-nowrap cursor-pointer`}
        >
          <span
            className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${safeFormData.useCurrentLocation ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <span className="ml-2 text-sm text-gray-700">
          ใช้ตำแหน่งปัจจุบันของฉัน
        </span>
      </div>
      {!safeFormData.useCurrentLocation && (
        <input
          type="text"
          id="location"
          name="location"
          value={safeFormData.location || ""}
          onChange={handleInputChange}
          placeholder="ระบุย่าน เมือง หรือรหัสไปรษณีย์ของคุณ"
          className={`w-full px-4 py-3 rounded-lg border ${safeErrors.location ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base`}
          disabled={safeFormData.useCurrentLocation}
        />
      )}
      {safeErrors.location && (
        <p className="mt-1 text-red-500 text-sm">{safeErrors.location}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        เราจะใช้ข้อมูลนี้เพื่อจับคู่คุณกับการบริจาคที่อยู่ใกล้เคียง
      </p>
    </div>
  );
};

export default LocationInput;