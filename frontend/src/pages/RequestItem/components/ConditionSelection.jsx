'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

const ConditionSelection = ({ value, onChange }) => {
  const conditions = [
    { value: 'Poor', text: 'สภาพไม่ดี', stars: 1 },
    { value: 'Fair', text: 'สภาพพอใช้', stars: 2 },
    { value: 'Good', text: 'สภาพดี', stars: 3 },
    { value: 'Like_New', text: 'เหมือนใหม่', stars: 4 },
    { value: 'New', text: 'ใหม่', stars: 5 }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        สภาพที่ต้องการ
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {conditions.map((condition) => (
          <button
            key={condition.value}
            type="button"
            onClick={() => onChange({ target: { name: 'condition', value: condition.value } })}
            className={`p-3 rounded-lg border ${
              value === condition.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            } transition-colors`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={i < condition.stars ? fasStar : farStar}
                    className={`${
                      i < condition.stars
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } w-4 h-4`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{condition.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConditionSelection;