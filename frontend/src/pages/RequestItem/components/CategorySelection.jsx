'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox
} from '@fortawesome/free-solid-svg-icons';

const CategorySelection = ({ value, onChange }) => {
  const categories = [
    { value: 'เฟอร์นิเจอร์', icon: faCouch },
    { value: 'เสื้อผ้า', icon: faTshirt },
    { value: 'อิเล็กทรอนิกส์', icon: faLaptop },
    { value: 'เครื่องใช้ไฟฟ้า', icon: faBlender },
    { value: 'ของเล่นเด็ก', icon: faBaby },
    { value: 'หนังสือ', icon: faBook },
    { value: 'เครื่องครัว', icon: faUtensils },
    { value: 'กีฬา', icon: faFutbol },
    { value: 'ของใช้ในบ้าน', icon: faHome },
    { value: 'อื่นๆ', icon: faBox }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        หมวดหมู่
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange({ target: { name: 'category', value: category.value } })}
            className={`p-3 rounded-lg border ${
              value === category.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            } transition-colors`}
          >
            <div className="flex flex-col items-center space-y-2">
              <FontAwesomeIcon
                icon={category.icon}
                className={`w-6 h-6 ${
                  value === category.value
                    ? 'text-blue-500'
                    : 'text-gray-500'
                }`}
              />
              <span className="text-sm font-medium">{category.value}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;