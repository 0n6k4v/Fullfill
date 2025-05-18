import React from 'react';

const PasswordStrengthMeter = ({ strength = 0 }) => {
  const getStrengthColor = (level) => {
    if (!level) return 'bg-gray-200';
    
    if (level <= 1) return 'bg-red-500';
    if (level <= 2) return 'bg-yellow-500';
    if (level <= 3) return 'bg-green-400';
    return 'bg-green-600';
  };

  return (
    <>
      <div className="mt-2 flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 w-1/4 rounded-full ${
              strength >= level ? getStrengthColor(level) : 'bg-gray-200'
            }`}
          ></div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ
      </p>
    </>
  );
};

export default PasswordStrengthMeter;