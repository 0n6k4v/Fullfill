import React from "react";

const ConditionSelection = ({ formData = {}, handleConditionSelect = () => {}, conditionOptions = [] }) => {
  // Ensure formData and conditionOptions are objects/arrays
  const safeFormData = typeof formData === 'object' && formData !== null ? formData : {};
  const safeConditionOptions = Array.isArray(conditionOptions) ? conditionOptions : [];

  // Map condition names to Thai
  const getThaiConditionName = (condition) => {
    const conditionMap = {
      'Poor': 'สภาพไม่ดี',
      'Fair': 'สภาพพอใช้',
      'Good': 'สภาพดี',
      'Like New': 'เหมือนใหม่',
      'New': 'ใหม่'
    };
    return conditionMap[condition] || condition;
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        สภาพที่ต้องการ
      </label>
      <div className="flex flex-wrap gap-3">
        {safeConditionOptions.map((condition) => (
          <button
            key={condition}
            type="button"
            onClick={() => handleConditionSelect(condition)}
            className={`px-4 py-2 rounded-lg border ${(safeFormData.condition || '') === condition ? "bg-blue-100 border-blue-500 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors !rounded-button whitespace-nowrap cursor-pointer`}
          >
            {getThaiConditionName(condition)}
          </button>
        ))}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        เลือกสภาพขั้นต่ำที่ยอมรับได้สำหรับสิ่งของที่คุณต้องการ
      </p>
    </div>
  );
};

export default ConditionSelection;