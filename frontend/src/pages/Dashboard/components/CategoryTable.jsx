import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faBook, faUtensils, faQuestionCircle, faBoxOpen, faHeartbeat, faBriefcaseMedical, faChild, faHome } from '@fortawesome/free-solid-svg-icons'; // Added more icons

const getIconByName = (iconName) => {
  switch (iconName) {
    case 'faTshirt': return faTshirt;
    case 'faBook': return faBook;
    case 'faUtensils': return faUtensils;
    case 'faBoxOpen': return faBoxOpen;
    case 'faHeartbeat': return faHeartbeat;
    case 'faBriefcaseMedical': return faBriefcaseMedical;
    case 'faChild': return faChild;
    case 'faHome': return faHome;
    default: return faQuestionCircle;
  }
};

const CategoryTable = ({ categoryData }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No data available for most needed items analysis.</p>
      </div>
    );
  }

  const sortedData = [...categoryData].sort((a, b) => {
    if (b.shortage !== a.shortage) {
      return b.shortage - a.shortage;
    }
    return a.fulfillmentRate - b.fulfillmentRate;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Analysis of Needs and Fulfillment by Category
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
                Fulfilled Requests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shortage / Donation Surplus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fulfillment Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => {
              console.log(row);
              
              const totalRequests = row.totalRequestsInCategory;
              const availableDonations = row.availableDonationsInCategory;
              const fulfilledRequests = Math.min(totalRequests, availableDonations);
              
              const requestShortage = totalRequests - fulfilledRequests;
              const donationSurplus = availableDonations - fulfilledRequests;

              const actualFulfillmentRate = totalRequests > 0 ? (fulfilledRequests / totalRequests) * 100 : (availableDonations > 0 ? 100 : 0);


              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={getIconByName(row.icon)} className={`mr-3 text-gray-600 w-5 h-5`} />
                      <span className="text-sm text-gray-900">{row.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {totalRequests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fulfilledRequests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {requestShortage > 0 ? (
                      <span className="text-red-500 text-sm font-medium">{requestShortage.toLocaleString()} items needed</span>
                    ) : donationSurplus > 0 ? (
                      <span className="text-green-500 text-sm font-medium">{donationSurplus.toLocaleString()} items surplus (donations)</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Balanced</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className={`h-2.5 rounded-full ${actualFulfillmentRate >= 75 ? 'bg-green-500' : actualFulfillmentRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(actualFulfillmentRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{actualFulfillmentRate.toFixed(1)}%</span>
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