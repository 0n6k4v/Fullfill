import React from "react";

const ProgressBar = ({ formProgress }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-800">Request an Item</h2>
          <span className="text-sm text-gray-600">
            {formProgress}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;