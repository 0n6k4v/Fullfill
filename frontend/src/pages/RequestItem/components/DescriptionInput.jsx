import React from "react";

const DescriptionInput = ({ formData = {}, handleInputChange = () => {} }) => {
  // Ensure formData is an object
  const safeFormData = typeof formData === 'object' && formData !== null ? formData : {};

  return (
    <div className="mb-8">
      <label
        htmlFor="description"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        รายละเอียด
      </label>
      <textarea
        id="description"
        name="description"
        value={safeFormData.description || ""}
        onChange={handleInputChange}
        placeholder="อธิบายรายละเอียดของสิ่งของที่คุณต้องการ เช่น ขนาด สี คุณสมบัติพิเศษ ฯลฯ"
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-base"
      ></textarea>
      <p className="mt-1 text-sm text-gray-500">
        ยิ่งคุณให้รายละเอียดมากเท่าไหร่ เราจะสามารถจับคู่คุณกับการบริจาคที่เหมาะสมได้ดีขึ้นเท่านั้น
      </p>
    </div>
  );
};

export default DescriptionInput;