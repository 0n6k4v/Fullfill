import React from 'react';

const PasswordStrengthMeter = ({ strength }) => {
  return (
    <>
      <div className="mt-2 flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 w-1/4 rounded-full ${
              strength >= level
                ? level <= 1
                  ? "bg-red-500"
                  : level <= 2
                    ? "bg-yellow-500"
                    : level <= 3
                      ? "bg-green-400"
                      : "bg-green-600"
                : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Password should be at least 8 characters with uppercase,
        lowercase, numbers, and special characters
      </p>
    </>
  );
};

export default PasswordStrengthMeter;