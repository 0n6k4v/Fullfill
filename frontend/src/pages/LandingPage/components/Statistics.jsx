import React from "react";

const Statistics = () => {
  return (
      <section className="bg-gradient-to-b from-blue-50 to-violet-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-12">
            Making a Difference Together
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center border border-white/20 hover:bg-white/90 transition-all">
              <div className="text-blue-600 text-5xl font-bold mb-4">3,582</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Successful Matches
              </h3>
              <p className="text-gray-600">
                Items successfully donated to those in need
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center border border-white/20 hover:bg-white/90 transition-all">
              <div className="text-green-500 text-5xl font-bold mb-4">247</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Partner Organizations
              </h3>
              <p className="text-gray-600">
                Working together to distribute donations
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center border border-white/20 hover:bg-white/90 transition-all">
              <div className="text-yellow-500 text-5xl font-bold mb-4">92%</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Match Rate
              </h3>
              <p className="text-gray-600">
                Of donations find their perfect match
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Statistics;