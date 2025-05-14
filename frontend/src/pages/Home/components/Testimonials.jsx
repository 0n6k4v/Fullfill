import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-4">
                    "Thanks to Fulfill, we were able to furnish our entire
                    shelter with donated items. The platform made it incredibly
                    easy to list our needs and connect with generous donors."
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Sarah Johnson
                      </h4>
                      <p className="text-sm text-gray-500">
                        Hope Shelter Director
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 mb-4">
                    "I had a garage full of items I no longer needed but were
                    still in great condition. Fulfill helped me connect with
                    people who could actually use these things instead of
                    throwing them away."
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Michael Torres
                      </h4>
                      <p className="text-sm text-gray-500">Regular Donor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Testimonials;