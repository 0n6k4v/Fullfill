import React from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, faTwitter, faInstagram, faLinkedinIn,
  faCcVisa, faCcMastercard, faCcPaypal 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-amber-400">Ful</span>fill
              </h3>
              <p className="mb-4">
                Connecting donors and recipients to create a more sustainable
                and compassionate community.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faFacebookF}/>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTwitter}/>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faInstagram}/>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faLinkedinIn}/>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Partner Organizations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Donation Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Subscribe
              </h4>
              <p className="mb-4">
                Stay updated with our latest news and features
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full"
                />
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-2xl"/>
                </button>
              </div>
              <div className="mt-4">
                <p>Secure payments via:</p>
                <div className="flex space-x-3 mt-2">
                  <FontAwesomeIcon icon={faCcVisa} className="text-2xl"/>
                  <FontAwesomeIcon icon={faCcMastercard} className="text-2xl"/>
                  <FontAwesomeIcon icon={faCcPaypal} className="text-2xl"/>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2025 Fulfill. All rights reserved. | May 01, 2025</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;