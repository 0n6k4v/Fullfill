"use client";

import React, { useState } from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = React.useRef(null);

  // Example notification data - in a real app, this would come from an API or context
  const notifications = [
    {
      id: 1,
      user_id: 101,
      receiver_id: 1, // current user
      type: "new_item",
      message: "New donation opportunity available",
      is_read: false,
      created_at: "2025-05-18T10:30:00",
      updated_at: "2025-05-18T10:30:00",
      itemid: 201,
      itemstatus: 1
    },
    {
      id: 2,
      user_id: 102,
      receiver_id: 1, // current user
      type: "item_accepted",
      message: "Your donation has been accepted",
      is_read: false,
      created_at: "2025-05-18T09:15:00",
      updated_at: "2025-05-18T09:15:00",
      itemid: 202,
      itemstatus: 2
    },
    {
      id: 3,
      user_id: 103,
      receiver_id: 1, // current user
      type: "thank_you",
      message: "Thank you for your recent contribution",
      is_read: true,
      created_at: "2025-05-17T14:45:00",
      updated_at: "2025-05-17T14:45:00",
      itemid: 203,
      itemstatus: 3
    }
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Helper function to format notification timestamps in a user-friendly way
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  // Handle click outside of notifications dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const markAllAsRead = () => {
    // In a real app, you would update this through an API call
    // Example API call:
    // fetch('/api/notifications/mark-all-read', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ receiver_id: currentUserId })
    // })

    // For demo purposes, we'll just update the local state
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      is_read: true,
      updated_at: new Date().toISOString()
    }));

    console.log("Marking all notifications as read:", updatedNotifications);
    // In a real implementation, you would update your state with the new notifications
    alert("All notifications marked as read");
  };

  return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              <span className="text-indigo-500">Ful</span>fill
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Organizations
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Success Stories
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              About Us
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer relative"
                onClick={toggleNotifications}
              >
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {notifications.some(n => !n.is_read) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                            {!notification.is_read && (
                              <span className="bg-blue-500 rounded-full w-2 h-2 self-start mt-1"></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">
                              {notification.type.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.created_at)}
                            </p>
                          </div>
                          {notification.itemid && (
                            <p className="text-xs text-gray-500 mt-1">
                              Item #{notification.itemid} • Status: {notification.itemstatus}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-center text-gray-500">No notifications</p>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2 text-center border-t border-gray-100">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </header>
  );
};

export default Header;
