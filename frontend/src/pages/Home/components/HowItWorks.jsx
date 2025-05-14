import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faCamera, faMagic } from '@fortawesome/free-solid-svg-icons';

const HowItWorks = () => {
  return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            How Fulfill Works
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our platform makes donating and requesting items simple and
            efficient
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100/50">
                <FontAwesomeIcon icon={faCamera} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                1. Post Your Item
              </h3>
              <p className="text-gray-600">
                Take a photo of your item, our AI will help describe it, or
                request something you need
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100/50">
                <FontAwesomeIcon icon={faMagic} className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2. Get Matched
              </h3>
              <p className="text-gray-600">
                Our smart matching system connects donations with requests based
                on needs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-100/50">
                <FontAwesomeIcon icon={faHandshake} className="text-3xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3. Complete the Exchange
              </h3>
              <p className="text-gray-600">
                Coordinate the pickup or delivery and make a difference in your
                community
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md !rounded-button whitespace-nowrap cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </section>
  );
};

export default HowItWorks;