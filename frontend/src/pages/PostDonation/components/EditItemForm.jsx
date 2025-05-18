// src/app/EditPostDonation/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../services/api';
import ProtectedRoute from '../../components/ProtectedRoute';

const EditPostDonation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    quantity: 1,
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // โหลดข้อมูลเดิมของโพสต์
  useEffect(() => {
    const fetchItemData = async () => {
      if (!itemId) {
        router.push('/'); // ถ้าไม่มี itemId ให้กลับไปหน้าหลัก
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/items/${itemId}`);
        
        // นำข้อมูลที่ได้มาใส่ในฟอร์ม
        setFormData({
          name: response.data.name,
          description: response.data.description,
          category: response.data.category,
          condition: response.data.condition,
          quantity: response.data.quantity,
          // เพิ่ม fields อื่นๆ
        });
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('ไม่สามารถโหลดข้อมูลโพสต์ได้');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItemData();
  }, [itemId, router]);
  
  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // ส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemId) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await api.put(`/items/${itemId}`, formData);
      
      // เมื่อแก้ไขสำเร็จ กลับไปยังหน้ารายละเอียดโพสต์
      router.push(`/items/${itemId}`);
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">แก้ไขรายการบริจาค</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อสิ่งของ
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              หมวดหมู่
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="clothing">เสื้อผ้า</option>
              <option value="electronics">อุปกรณ์อิเล็กทรอนิกส์</option>
              <option value="books">หนังสือ</option>
              <option value="furniture">เฟอร์นิเจอร์</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              สภาพ
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">เลือกสภาพ</option>
              <option value="new">ใหม่</option>
              <option value="like_new">เหมือนใหม่</option>
              <option value="good">ดี</option>
              <option value="fair">พอใช้</option>
              <option value="poor">ต้องซ่อมแซม</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              จำนวน
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* เพิ่ม fields อื่นๆ ตามต้องการ */}
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditPostDonation;