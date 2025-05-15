import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faBook, faUtensils, faBox } from '@fortawesome/free-solid-svg-icons';

const CategoryTable = ({ categoryData }) => {
  // Helper function to get appropriate icon based on category name
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'clothing':
        return { icon: faTshirt, color: 'text-indigo-500' };
      case 'schoolSupplies':
        return { icon: faBook, color: 'text-green-500' };
      case 'foodItems':
        return { icon: faUtensils, color: 'text-purple-500' };
      default:
        return { icon: faBox, color: 'text-blue-500' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Category-wise Analysis
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Requests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available Donations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Shortage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(categoryData).map(([category, data]) => {
              const { icon, color } = getCategoryIcon(category);
              
              return (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={icon} className={`${color} mr-2`} />
                      <span className="text-sm text-gray-900">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.requests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.donations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-500 text-sm">
                      {data.shortage} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-indigo-500 rounded-full h-2"
                          style={{ width: `${data.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {data.rate}%
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