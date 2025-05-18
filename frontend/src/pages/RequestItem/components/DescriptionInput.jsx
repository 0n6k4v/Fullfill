'use client';

import React from 'react';

const DescriptionInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        รายละเอียด
      </label>
      <textarea
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        rows={4}
        placeholder="อธิบายรายละเอียดของสิ่งของที่คุณต้องการ เช่น ขนาด สี วัสดุ หรือความต้องการพิเศษ"
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
      <p className="text-xs text-gray-500">
        ยิ่งระบุรายละเอียดมากเท่าไหร่ โอกาสที่จะได้สิ่งของที่ตรงตามความต้องการก็จะมากขึ้นเท่านั้น
      </p>
    </div>
  );
};

export default DescriptionInput;