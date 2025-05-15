import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faMapMarkerAlt, 
  faPlus, 
  faMinus, 
  faLocationArrow,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const MapView = ({ filteredPosts, selectedMarker, setSelectedMarker, mapZoom, setMapZoom }) => {
  return (
    <>
      <div className="flex h-[calc(100vh-240px)] min-h-[600px] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {/* Map */}
        <div id="map" className="w-2/3 h-full bg-gray-100"></div>
        
        {/* Sidebar */}
        <div className="w-1/3 h-full overflow-y-auto border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredPosts.length} Items Near You
            </h2>
            <p className="text-sm text-gray-500">
              Click on a marker to view details
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedMarker === post.id ? "bg-indigo-50" : ""}`}
                onClick={() => setSelectedMarker(post.id)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.type === "Donation"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {post.distance}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mt-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-1" />
                      <span>{post.user}</span>
                      <span className="mx-1">•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="flex justify-between mt-4">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Donations</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Requests</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer !rounded-button"
            onClick={() => setMapZoom((prev) => Math.min(prev + 1, 18))}
          >
            <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
          </button>
          <button
            className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer !rounded-button"
            onClick={() => setMapZoom((prev) => Math.max(prev - 1, 8))}
          >
            <FontAwesomeIcon icon={faMinus} className="text-gray-600" />
          </button>
          <button className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer !rounded-button">
            <FontAwesomeIcon icon={faLocationArrow} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Selected Item Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {filteredPosts
              .filter((post) => post.id === selectedMarker)
              .map((post) => (
                <div key={post.id} className="relative">
                  <button
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer !rounded-button"
                    onClick={() => setSelectedMarker(null)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                  </button>
                  <div className="h-64 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          post.type === "Donation"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.type}
                      </span>
                    </div>
                  </div>
                  {/* Post details... */}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MapView;