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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-amber-400">Ful</span>fill
              </h3>
              <p className="mb-4">
                เชื่อมโยงผู้บริจาคและผู้รับเพื่อสร้างชุมชนที่ยั่งยืน
                และเปี่ยมด้วยความเอื้ออาทรมากขึ้น
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
                ลิงก์ด่วน
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    หน้าหลัก
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    เกี่ยวกับเรา
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    วิธีการทำงาน
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    เรื่องราวความสำเร็จ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    ติดต่อเรา
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                แหล่งข้อมูล
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    องค์กรพันธมิตร
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    แนวทางการบริจาค
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    คำถามที่พบบ่อย
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    บล็อก
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    นโยบายความเป็นส่วนตัว
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                สมัครรับข่าวสาร
              </h4>
              <p className="mb-4">
                อัปเดตข่าวสารและฟีเจอร์ใหม่ล่าสุดของเรา
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  className="px-4 py-2 rounded-l-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full"
                />
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-2xl"/>
                </button>
              </div>
              <div className="mt-4">
                <p>ชำระเงินอย่างปลอดภัยผ่าน:</p>
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