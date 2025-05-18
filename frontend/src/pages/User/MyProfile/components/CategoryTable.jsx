import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faBook, faUtensils, faBox } from '@fortawesome/free-solid-svg-icons';

const CategoryTable = ({ categoryData = {} }) => {
  // Ensure categoryData is an object
  const safeCategoryData = typeof categoryData === 'object' && categoryData !== null ? categoryData : {};

  // Helper function to get appropriate icon based on category name
  const getCategoryIcon = (category) => {
    if (!category) return { icon: faBox, color: 'text-blue-500' };
    
    switch(String(category).toLowerCase()) {
      case 'clothing':
        return { icon: faTshirt, color: 'text-indigo-500' };
      case 'schoolsupplies':
        return { icon: faBook, color: 'text-green-500' };
      case 'fooditems':
        return { icon: faUtensils, color: 'text-purple-500' };
      default:
        return { icon: faBox, color: 'text-blue-500' };
    }
  };

  const formatCategoryName = (category) => {
    if (!category) return 'ไม่ระบุหมวดหมู่';
    return String(category)
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, str => str.toUpperCase());
  };

  if (Object.keys(safeCategoryData).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            การวิเคราะห์ตามหมวดหมู่
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500">ไม่พบข้อมูลหมวดหมู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          การวิเคราะห์ตามหมวดหมู่
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หมวดหมู่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนคำขอทั้งหมด
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนการบริจาคที่มี
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จำนวนที่ขาดแคลน
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อัตราการเติมเต็ม
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(safeCategoryData).map(([category, data]) => {
              if (!data || typeof data !== 'object') return null;
              
              const { icon, color } = getCategoryIcon(category);
              const safeData = {
                requests: data.requests || 0,
                donations: data.donations || 0,
                shortage: data.shortage || 0,
                rate: data.rate || 0
              };
              
              return (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={icon} className={`${color} mr-2`} />
                      <span className="text-sm text-gray-900">
                        {formatCategoryName(category)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeData.requests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeData.donations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-500 text-sm">
                      {safeData.shortage} รายการ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-indigo-500 rounded-full h-2"
                          style={{ width: `${Math.min(Math.max(safeData.rate, 0), 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {safeData.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;