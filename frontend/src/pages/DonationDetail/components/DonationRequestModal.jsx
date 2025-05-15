'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DonationRequestModal = ({ isOpen, onClose }) => {
  const [donationRequest, setDonationRequest] = useState({
    reason: '',
    pickupDate: '',
    pickupTime: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    onClose();
    alert("ส่งคำขอรับบริจาคเรียบร้อยแล้ว");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            ขอรับบริจาค
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 !rounded-button"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              เหตุผลที่ต้องการขอรับบริจาค
            </label>
            <textarea
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={4}
              value={donationRequest.reason}
              onChange={(e) =>
                setDonationRequest({
                  ...donationRequest,
                  reason: e.target.value,
                })
              }
              placeholder="กรุณาระบุเหตุผลที่ต้องการขอรับบริจาค..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              วันที่สะดวกรับสินค้า
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={donationRequest.pickupDate}
              onChange={(e) =>
                setDonationRequest({
                  ...donationRequest,
                  pickupDate: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              เวลาที่สะดวกรับสินค้า
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={donationRequest.pickupTime}
              onChange={(e) =>
                setDonationRequest({
                  ...donationRequest,
                  pickupTime: e.target.value,
                })
              }
            >
              <option value="">เลือกเวลา</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md !rounded-button whitespace-nowrap"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md !rounded-button whitespace-nowrap"
            >
              ส่งคำขอ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationRequestModal;