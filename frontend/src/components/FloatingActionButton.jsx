'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGift, faHandHoldingHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 z-10">
            {/* Dropdown Menu */}
            {isOpen && (
                <div className="flex flex-col-reverse gap-3 mb-3 items-end">
                {/* Post Donation */}
                <Link href="/PostDonation" className="flex items-center">
                    <span className="bg-white shadow-md rounded-lg py-2 px-4 mr-3 text-sm font-medium text-gray-700">
                    Post Donation
                    </span>
                    <div className="h-12 w-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
                    <FontAwesomeIcon icon={faGift} className="text-lg" />
                    </div>
                </Link>
                
                {/* Request Item */}
                <Link href="/RequestItem" className="flex items-center">
                    <span className="bg-white shadow-md rounded-lg py-2 px-4 mr-3 text-sm font-medium text-gray-700">
                    Request Item
                    </span>
                    <div className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110">
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-lg" />
                    </div>
                </Link>
                </div>
            )}

            {/* Main Button */}
            <div className="flex flex-col-reverse gap-3 mb-3 items-end">
                <button 
                    onClick={toggleMenu}
                    className={`h-14 w-14 rounded-full ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110`}
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faPlus} className="text-2xl" />
                </button>
            </div>
        </div>
    )
}

export default FloatingActionButton;
