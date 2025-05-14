import React from "react";

const ConditionSelection = ({ formData = {}, handleConditionSelect, conditionOptions = [] }) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Preferred condition
      </label>
      <div className="flex flex-wrap gap-3">
        {conditionOptions.map((condition) => (
          <button
            key={condition}
            type="button"
            onClick={() => handleConditionSelect(condition)}
            className={`px-4 py-2 rounded-lg border ${(formData?.condition || '') === condition ? "bg-blue-100 border-blue-500 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors !rounded-button whitespace-nowrap cursor-pointer`}
          >
            {condition}
          </button>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Select the minimum acceptable condition for the item you're
        requesting.
      </p>
    </div>
  );
};

export default ConditionSelection;