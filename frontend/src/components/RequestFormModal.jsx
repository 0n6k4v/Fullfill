'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const RequestFormModal = ({ isOpen = false, onClose = () => {}, post = null, onSubmit = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (!e) return;
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData.name || !formData.phone || !formData.message) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      // เรียกใช้ onSubmit callback
      await onSubmit({
        ...formData,
        postId: post?.id
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          preferredDate: '',
          preferredTime: ''
        });
      }, 2000);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                ขอรับบริจาค: {post?.title || 'ไม่ระบุชื่อ'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                aria-label="ปิด"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                ส่งคำขอสำเร็จ
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    ข้อความ *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                      วันที่ต้องการรับ
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      id="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                      เวลาที่ต้องการรับ
                    </label>
                    <input
                      type="time"
                      name="preferredTime"
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  ) : null}
                  {loading ? 'กำลังส่ง...' : 'ส่งคำขอ'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFormModal;