import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faBook, faUtensils } from '@fortawesome/free-solid-svg-icons';

const CategoryTable = () => {
  const categoryRows = [
    {
      category: 'Winter Clothing',
      icon: faTshirt,
      iconColor: 'text-blue-500',
      requests: 245,
      donations: 156,
      shortage: 89,
      rate: 64
    },
    {
      category: 'School Supplies',
      icon: faBook,
      iconColor: 'text-green-500',
      requests: 189,
      donations: 142,
      shortage: 47,
      rate: 75
    },
    {
      category: 'Food Items',
      icon: faUtensils,
      iconColor: 'text-purple-500',
      requests: 312,
      donations: 278,
      shortage: 34,
      rate: 89
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Most Needed Items
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
                Shortage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoryRows.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={row.icon} className={`${row.iconColor} mr-2`} />
                    <span className="text-sm text-gray-900">{row.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.requests}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.donations}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-red-500 text-sm">{row.shortage} items</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 rounded-full h-2"
                        style={{ width: `${row.rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{row.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;