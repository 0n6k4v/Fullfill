import React from "react";

const DescriptionInput = ({ formData = {}, handleInputChange }) => {
  return (
    <div className="mb-8">
      <label
        htmlFor="description"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={formData?.description || ""}
        onChange={handleInputChange}
        placeholder="Describe the item you need in detail. Include size, color preferences, specific features, etc."
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base"
      ></textarea>
      <p className="mt-1 text-sm text-gray-500">
        The more details you provide, the better we can match you with
        the right donation.
      </p>
    </div>
  );
};

export default DescriptionInput;