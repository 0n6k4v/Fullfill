import React from "react";

const ItemNameInput = ({ formData = {}, handleInputChange, errors = {} }) => {
  return (
    <div className="mb-8">
      <label
        htmlFor="itemName"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        What item are you looking for? <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="itemName"
        name="itemName"
        value={formData.itemName || ""}
        onChange={handleInputChange}
        placeholder="e.g., Baby Stroller, Office Chair, Winter Coat"
        className={`w-full px-4 py-3 rounded-lg border ${errors?.itemName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base`}
      />
      {errors?.itemName && (
        <p className="mt-1 text-red-500 text-sm">{errors.itemName}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        Be specific about the item you need to increase your chances of
        finding a match.
      </p>
    </div>
  );
};

export default ItemNameInput;