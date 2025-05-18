import React from 'react';

const DonationTabs = ({ activeTab, setActiveTab, donationCounts }) => {
  const tabs = [
    { id: 'all', label: 'All', count: donationCounts.all },
    { id: 'available', label: 'Available', count: donationCounts.available },
    { id: 'matched', label: 'Matched', count: donationCounts.matched },
    { id: 'fulfilled', label: 'Fulfilled', count: donationCounts.fulfilled }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {tabs.map(tab => (
            <option key={tab.id} value={tab.id}>{tab.label} ({tab.count})</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm cursor-pointer !rounded-button whitespace-nowrap`}
              >
                {tab.label}
                <span className={`${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DonationTabs;