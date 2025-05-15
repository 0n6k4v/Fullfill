import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const EmptyState = () => {
  return (
    <div className="col-span-3 py-12 text-center">
      <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-5xl mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No results found
      </h3>
      <p className="text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
};

export default EmptyState;