import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTag, 
  faMapMarkerAlt, 
  faClock, 
  faHandshake, 
  faCheckCircle, 
  faEllipsisV,
  faEdit, 
  faTimes, 
  faCheck, 
  faAddressBook, 
  faRedo 
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../../../services/api'; // ต้องปรับ path ตามโครงสร้างโปรเจคของคุณ

const PostCard = ({ post, activeTab, onPostDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // ฟังก์ชันสำหรับลบโพสต์
  const handleDelete = async () => {
    // แสดง confirm dialog
    if (!window.confirm('คุณต้องการลบโพสต์นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      
      // เรียกใช้ API endpoint สำหรับลบโพสต์
      await api.delete(`/items/${post.id}`);
      
      // แจ้ง parent component ว่าโพสต์ถูกลบแล้ว
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
      
      // แสดงข้อความแจ้งเตือนว่าลบสำเร็จ
      alert('ลบโพสต์เรียบร้อยแล้ว');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('ไม่สามารถลบโพสต์ได้ โปรดลองอีกครั้ง');
      alert('เกิดข้อผิดพลาดในการลบโพสต์: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // เพิ่ม handler สำหรับปุ่ม Edit
  const handleEdit = () => {
    // นำทางไปยังหน้าแก้ไขโพสต์
    window.location.href = `/EditPostDonation?itemId=${post.id}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* ส่วนแสดงรูปภาพ */}
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      {/* ส่วนแสดงข้อมูล */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faTag} className="mr-1 text-gray-400" />
              <span>{post.category}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-400" />
              <span>{post.location}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-400" />
              <span>Posted {post.postedDate}</span>
            </div>
            {activeTab === "matched" && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <FontAwesomeIcon icon={faHandshake} className="mr-1" />
                <span>Matched with {post.matchedWith}</span>
              </div>
            )}
            {activeTab === "completed" && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                <span>Received by {post.receivedBy}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <button className="text-gray-400 hover:text-gray-500 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
        
        {/* ส่วนแสดงปุ่มกดต่างๆ */}
        <div className="mt-4 flex justify-between">
          {activeTab === "active" && (
            <>
              <button 
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" /> 
                {isDeleting ? "กำลังลบ..." : "Cancel"}
              </button>
            </>
          )}
          {activeTab === "matched" && (
            <>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Mark as Received
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faAddressBook} className="mr-1" /> View Contact
              </button>
            </>
          )}
          {activeTab === "completed" && (
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> Post Similar
            </button>
          )}
        </div>
        
        {/* แสดงข้อความ error หากมี */}
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;