'use client';

import React from 'react';

const ItemNameInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        ชื่อสิ่งของ
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="ระบุชื่อสิ่งของที่คุณต้องการ"
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
      <p className="text-xs text-gray-500">
        กรุณาระบุชื่อสิ่งของที่ชัดเจน เพื่อให้ผู้บริจาคเข้าใจง่าย
      </p>
    </div>
  );
};

export default ItemNameInput;