import React from "react";

const ItemNameInput = ({ formData = {}, handleInputChange = () => {}, errors = {} }) => {
  // Ensure formData and errors are objects
  const safeFormData = typeof formData === 'object' && formData !== null ? formData : {};
  const safeErrors = typeof errors === 'object' && errors !== null ? errors : {};

  return (
    <div className="mb-8">
      <label
        htmlFor="itemName"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        คุณกำลังมองหาสิ่งของอะไร? <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="itemName"
        name="itemName"
        value={safeFormData.itemName || ""}
        onChange={handleInputChange}
        placeholder="เช่น รถเข็นเด็ก เก้าอี้สำนักงาน เสื้อโค้ทฤดูหนาว"
        className={`w-full px-4 py-3 rounded-lg border ${safeErrors.itemName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base`}
      />
      {safeErrors.itemName && (
        <p className="mt-1 text-red-500 text-sm">{safeErrors.itemName}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        ระบุรายละเอียดของสิ่งของที่คุณต้องการให้ชัดเจนเพื่อเพิ่มโอกาสในการหาคู่ที่เหมาะสม
      </p>
    </div>
  );
};

export default ItemNameInput;