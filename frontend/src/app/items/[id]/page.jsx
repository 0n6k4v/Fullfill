"use client";

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, MapPin, Heart, Share2, Clock, Tag, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faCalendarAlt, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { getItemById, getSimilarItems } from '../../api/items';
import {
  getConditionColors,
  getCategoryIcon,
  formatDate,
  getStatusInfo
} from '../../../utils/itemHelpers';

const ItemPage = ({ params }) => {
  // Unwrap params at the beginning of your component
  const unwrappedParams = use(params);

  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  // Get status information from utility
  const { statusText, statusClass } = getStatusInfo();

  // Load saved items from localStorage
  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const saved = localStorage.getItem('savedItems');
        if (saved) {
          setSavedItems(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading saved items from localStorage:', err);
      }
    };

    loadSavedItems();
  }, []);

  useEffect(() => {
    // Fetch item data using our API
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use unwrappedParams.id instead
        const itemData = await getItemById(unwrappedParams.id);
        console.log(itemData);

        if (itemData) {
          setItem(itemData);

          // Use unwrappedParams.id here too
          const similar = await getSimilarItems(unwrappedParams.id, itemData.category);
          setSimilarItems(similar);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    console.log("Item ID:", unwrappedParams.id);
    if (unwrappedParams.id) {
      fetchData();
    }
  }, [unwrappedParams.id]); // Fixed dependency array

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  //     </div>
  //   );
  // }

  if (!item) {
    return (

      <div className="min-h-screen bg-gray-50 p-8">
        <Link href="/" className="flex items-center text-indigo-600 mb-8 hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Back to catalog
        </Link>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle size={50} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleRequestItem = () => {
    setShowContactModal(true);
  };

  const handleSaveItem = () => {
    if (item) {
      toggleSavedItem(item.id);
    }
  };

  const isItemSaved = (itemId) => {
    return savedItems.includes(itemId);
  };

  const toggleSavedItem = (itemId) => {
    const updatedSavedItems = isItemSaved(itemId)
      ? savedItems.filter(id => id !== itemId)
      : [...savedItems, itemId];

    setSavedItems(updatedSavedItems);

    // Update localStorage
    localStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to catalog navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <Link href="/" className="flex items-center text-indigo-600 hover:underline">
            <ArrowLeft size={20} className="mr-2" /> Back to catalog
          </Link>
        </div>
      </div>

      <main className="container mx-auto p-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main image */}
              <div className="h-96 relative">
                {/* <img
                  src={activeImage === 0 ? item.image.url : item.additionalImages?.[activeImage - 1]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                /> */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleSaveItem}
                    className={`p-2 rounded-full ${isItemSaved(item.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} shadow-md hover:bg-opacity-90 transition-colors`}
                    aria-label={isItemSaved(item.id) ? "Remove from saved items" : "Save this item"}
                  >
                    <Heart size={20} className={isItemSaved(item.id) ? 'fill-current' : ''} />
                  </button>
                  <button className="p-2 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {item.additionalImages && item.additionalImages.length > 0 && (
                <div className="flex p-2 space-x-2 overflow-x-auto">
                  <div
                    className={`h-20 w-20 flex-shrink-0 cursor-pointer border-2 ${activeImage === 0 ? 'border-indigo-600' : 'border-transparent'}`}
                    onClick={() => setActiveImage(0)}
                  >
                    <img src={item.image.url} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  {item.additionalImages.map((img, index) => (
                    <div
                      key={index}
                      className={`h-20 w-20 flex-shrink-0 cursor-pointer border-2 ${activeImage === index + 1 ? 'border-indigo-600' : 'border-transparent'}`}
                      onClick={() => setActiveImage(index + 1)}
                    >
                      <img src={img} alt={`${item.name} ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item details */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass[item.Status]}`}>
                  {statusText[item.Status]}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  <FontAwesomeIcon icon={getCategoryIcon(item.category)} className="mr-2" />
                  {item.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConditionColors(item.Condition).bg} ${getConditionColors(item.Condition).text}`}>
                  Condition: {item.Condition}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <MapPin size={20} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">{item.Location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock size={20} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Listed</h3>
                    <p className="text-gray-600">{formatDate(item.created_at)}</p>
                    <p className="text-gray-500 text-sm">Expires: {formatDate(item.Expire)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.Description}</p>
              </div>
            </div>
          </div>

          {/* Right column - User info and action buttons */}
          <div className="space-y-6">
            {/* User info card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="flex items-center mb-4">
                <img src={item.user.avatar} alt={item.user.name} className="h-12 w-12 rounded-full mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.user.name}</h4>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-700">{item.user.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{item.user.itemsShared} items shared</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Member since {formatDate(item.user.joinDate)}</p>

              {item.Status === 1 && (
                <button
                  onClick={handleRequestItem}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
                >
                  {item.TYPE === 'donation' ? 'Request This Item' : 'Offer This Item'}
                </button>
              )}

              {item.Status === 2 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle size={20} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-700 text-sm">
                      This item has been reserved by another user. You can still contact the owner if you're interested.
                    </p>
                  </div>
                </div>
              )}

              {item.Status === 3 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle size={20} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-700 text-sm">
                      This item has been fulfilled and is no longer available.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Safety tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-indigo-600" />
                Safety Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Meet in a public place
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Don't pay in advance
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Inspect the item before accepting
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Report suspicious behavior
                </li>
              </ul>
            </div>

            {/* Similar items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-gray-900 mb-4">Similar Items</h3>
              <div className="space-y-4">
                {similarItems.length > 0 ? (
                  similarItems.map(similarItem => (
                    <Link
                      href={`/items/${similarItem.id}`}
                      key={similarItem.id}
                      className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      {/* <img
                        src={similarItem.image.url}
                        alt={similarItem.name}
                        className="h-16 w-16 object-cover rounded-md mr-3"
                      /> */}
                      <div>
                        <h4 className="font-medium text-gray-900">{similarItem.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                          {similarItem.Location}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No similar items found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request "{item.name}"</h2>
              <p className="text-gray-600 mb-6">
                To request this item, please fill out this form. The owner will be notified and can contact you directly.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Owner
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    placeholder="Introduce yourself and explain why you're interested in this item..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Pickup/Meetup Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., Downtown coffee shop, Community center, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Contact Method
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>In-app messaging</option>
                    <option>Email</option>
                    <option>Phone</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here we would submit the request
                  setShowContactModal(false);
                  // Show confirmation or success message
                  alert("Your request has been sent!");
                }}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
