'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faUserCircle, 
  faUser, 
  faGift, 
  faHandHoldingHeart, 
  faEnvelope, 
  faCog, 
  faSignOutAlt,
  faBars,
  faTimes,
  faListAlt,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const GlobalHeader = ({ user = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
    
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // จำลองการดึงข้อมูลการแจ้งเตือน
    const fetchNotifications = async () => {
      try {
        // TODO: เรียก API จริง
        const mockNotifications = [
          {
            id: 1,
            message: 'มีผู้สนใจรับบริจาคสิ่งของของคุณ',
            time: '5 นาทีที่แล้ว',
            read: false
          },
          {
            id: 2,
            message: 'การบริจาคของคุณได้รับการยืนยันแล้ว',
            time: '1 ชั่วโมงที่แล้ว',
            read: true
          }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      // TODO: เรียก API logout
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsProfileMenuOpen(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-blue-600">
            <span className="text-indigo-500">Ful</span>fill
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <button className="p-1 mr-3 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faBell} />
            </button>
          )}
          <button 
            onClick={toggleMobileMenu}
            className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                หน้าหลัก
              </Link>
              <Link href="/Post" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                โพสต์
              </Link>
              <Link href="/Map" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                แผนที่
              </Link>
              <Link href="/Dashboard" className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                แดชบอร์ด
              </Link>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none">
                  <FontAwesomeIcon icon={faBell} />
                </button>
                <div className="relative" ref={profileRef}>
                  <button 
                    className="p-1 rounded-full text-gray-500 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none"
                    onClick={toggleProfileMenu}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white z-50"
                      style={{ top: "100%" }}
                    >
                      <Link
                        href="/User/MyProfile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> โปรไฟล์ของฉัน
                      </Link>
                      <Link
                        href="/User/MyPost"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faListAlt} className="mr-2" /> โพสต์ของฉัน
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                วิธีการทำงาน
              </Link>
              <Link
                href="/organizations"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                องค์กร
              </Link>
              <Link
                href="/success-stories"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                เรื่องราวความสำเร็จ
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                เกี่ยวกับเรา
              </Link>
              <Link href="/Auth" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                เข้าสู่ระบบ
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 space-y-3 pb-3">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>
                <Link 
                  href="/Post"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  โพสต์
                </Link>
                <Link 
                  href="/Map"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  แผนที่
                </Link>
                <Link 
                  href="/Dashboard"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  แดชบอร์ด
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/how-it-works"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  วิธีการทำงาน
                </Link>
                <Link 
                  href="/organizations"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  องค์กร
                </Link>
                <Link 
                  href="/success-stories"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เรื่องราวความสำเร็จ
                </Link>
                <Link 
                  href="/about"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link 
                  href="/Auth"
                  className="block text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;