import React from "react";
import Link from "next/link"; // เพิ่ม import Link จาก next/link
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  return (
      <section className="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjBmMGYwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Connect, Give, <span className="text-amber-500">Fulfill</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Match your donations with those who need them most. Our platform
              connects donors and recipients seamlessly, making the giving
              process efficient and meaningful.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/PostDonation">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Post Donation
                </button>
              </Link>
              <Link href="/RequestItem">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-md !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2" />
                  Request Item
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 z-10">
            <img
              src="https://readdy.ai/api/search-image?query=A%20heartwarming%20scene%20of%20diverse%20people%20exchanging%20donated%20items%2C%20with%20warm%20lighting%20and%20a%20modern%20minimalist%20setting.%20The%20image%20shows%20hands%20passing%20a%20wrapped%20gift%20box%20from%20one%20person%20to%20another%2C%20symbolizing%20generosity%20and%20community%20support.%20The%20background%20has%20soft%20gradient%20tones%20of%20light%20blue%20and%20green.&width=600&height=400&seq=7&orientation=landscape"
              alt="Donation exchange"
              className="rounded-lg shadow-xl object-cover w-full h-full object-top"
            />
          </div>
        </div>
      </section>
  );
};

export default HeroSection;