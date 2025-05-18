"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronUp, faChevronDown, faThLarge, faMapMarkerAlt,
  faSpinner, faMagic, faCloudUploadAlt, faTimes,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox, faStar as fasStar,
  faMapLocation
} from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { useRouter } from 'next/navigation';

// Import Leaflet ด้วย dynamic import เพื่อแก้ปัญหา window is not defined
// โหลดเฉพาะในฝั่ง client
const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'), 
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">กำลังโหลดแผนที่...</div>
  }
);

const DonationForm = ({ formData = {}, setFormData = () => {}, previewImages = [], setPreviewImages = () => {}, getConditionText = () => {}, categories = [] }) => {
  const router = useRouter();
  const { user = null, isAuthenticated = () => false } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [subdistrictId, setSubdistrictId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Set category and condition options from API or props
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryOptions(categories);
    } else {
      // Default categories if not provided
      setCategoryOptions([
        { name: "เฟอร์นิเจอร์", icon: "fa-couch" },
        { name: "เสื้อผ้า", icon: "fa-tshirt" },
        { name: "อิเล็กทรอนิกส์", icon: "fa-laptop" },
        { name: "เครื่องใช้ไฟฟ้า", icon: "fa-blender" },
        { name: "ของเล่นเด็ก", icon: "fa-baby" },
        { name: "หนังสือ", icon: "fa-book" },
        { name: "เครื่องครัว", icon: "fa-utensils" },
        { name: "อื่นๆ", icon: "fa-box" }
      ]);
    }
    
    // Set condition options
    setConditionOptions([
      { value: "Poor", text: "สภาพไม่ดี" },
      { value: "Fair", text: "สภาพพอใช้" },
      { value: "Good", text: "สภาพดี" },
      { value: "Like_New", text: "เหมือนใหม่" },
      { value: "New", text: "ใหม่" }
    ]);
  }, [categories]);

  // ดึงข้อมูลตำบลจาก API เมื่อมีการเลือกตำแหน่งบนแผนที่
  useEffect(() => {
    if (addressData && addressData.subdistrict && addressData.district && addressData.province) {
      // ถ้ามีข้อมูลสถานที่ (aoi) ให้ใส่ในฟิลด์ location
      if (addressData.placeName) {
        setFormData(prev => ({
          ...prev,
          location: addressData.placeName
        }));
      }
      
      // ดึง subdistrict ID โดยตรงจาก API ที่มีอยู่แล้ว
      const fetchSubdistrictId = async () => {
        try {
          // 1. ตรวจสอบว่ามีข้อมูลครบถ้วนก่อนเรียก API
          if (!addressData.subdistrict || !addressData.district || !addressData.province) {
            console.log("ข้อมูลตำบล อำเภอ หรือจังหวัดไม่ครบถ้วน");
            return;
          }
          
          console.log("กำลังค้นหาข้อมูลตำบล:", addressData.subdistrict);
          
          // 2. ดึงข้อมูลจังหวัดทั้งหมด
          const provincesResponse = await api.get('/provinces/');
          console.log("ดึงข้อมูลจังหวัดแล้ว");
          
          // 3. ค้นหาจังหวัดที่ตรงกับชื่อที่ได้จาก Longdo Map API
          const province = provincesResponse.data.find(p => 
            p.province_name.toLowerCase().includes(addressData.province.toLowerCase()) ||
            addressData.province.toLowerCase().includes(p.province_name.toLowerCase())
          );
          
          if (!province) {
            console.log("ไม่พบจังหวัด:", addressData.province);
            throw new Error(`ไม่พบจังหวัด: ${addressData.province}`);
          }
          
          console.log("พบจังหวัด:", province.province_name, "ID:", province.id);
          
          // 4. ดึงข้อมูลอำเภอในจังหวัดที่พบ
          const districtsResponse = await api.get('/districts/', {
            params: { province_id: province.id }
          });
          console.log("ดึงข้อมูลอำเภอแล้ว");
          
          // 5. ค้นหาอำเภอที่ตรงกับชื่อที่ได้จาก Longdo Map API
          const district = districtsResponse.data.find(d => 
            d.district_name.toLowerCase().includes(addressData.district.toLowerCase()) ||
            addressData.district.toLowerCase().includes(d.district_name.toLowerCase())
          );
          
          if (!district) {
            console.log("ไม่พบอำเภอ:", addressData.district);
            throw new Error(`ไม่พบอำเภอ: ${addressData.district}`);
          }
          
          console.log("พบอำเภอ:", district.district_name, "ID:", district.id);
          
          // 6. ดึงข้อมูลตำบลในอำเภอที่พบ
          const subdistrictsResponse = await api.get('/subdistricts/', {
            params: { district_id: district.id }
          });
          console.log("ดึงข้อมูลตำบลแล้ว");
          
          // 7. ค้นหาตำบลที่ตรงกับชื่อที่ได้จาก Longdo Map API
          const subdistrict = subdistrictsResponse.data.find(s => 
            s.subdistrict_name.toLowerCase().includes(addressData.subdistrict.toLowerCase()) ||
            addressData.subdistrict.toLowerCase().includes(s.subdistrict_name.toLowerCase())
          );
          
          if (!subdistrict) {
            console.log("ไม่พบตำบล:", addressData.subdistrict);
            throw new Error(`ไม่พบตำบล: ${addressData.subdistrict}`);
          }
          
          console.log("พบตำบล:", subdistrict.subdistrict_name, "ID:", subdistrict.id);
          
          // บันทึก subdistrict ID
          setSubdistrictId(subdistrict.id);
          
          // เพิ่ม subdistrict_id เข้าไปในฟอร์ม
          setFormData(prev => ({
            ...prev,
            subdistrict_id: subdistrict.id,
            // เก็บข้อมูลอื่นๆ ไว้ด้วยเผื่อต้องใช้
            province_id: province.id,
            province_name: province.province_name, 
            district_id: district.id,
            district_name: district.district_name,
            subdistrict_name: subdistrict.subdistrict_name
          }));
          
          console.log("บันทึกข้อมูลตำบลเรียบร้อย - ID:", subdistrict.id);
          
        } catch (error) {
          console.error("Error finding subdistrict ID:", error.message);
          
          // ในกรณีที่เกิดข้อผิดพลาด ให้เก็บชื่อตำบลไว้ใช้แทน
          setFormData(prev => ({
            ...prev,
            subdistrict_name: addressData.subdistrict,
            district_name: addressData.district,
            province_name: addressData.province
          }));
        }
      };
      
      fetchSubdistrictId();
    }
  }, [addressData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle condition rating change
  const handleConditionChange = (condition) => {
    setFormData({
      ...formData,
      condition,
    });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category,
    });
    setIsCategoryDropdownOpen(false);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    // Create a copy of the photos array if it doesn't exist
    const currentPhotos = formData.photos || [];
    const updatedPhotos = [...currentPhotos, ...newFiles].slice(0, 5); // Limit to 5 photos

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });

    // Generate preview URLs
    const newPreviewImages = updatedPhotos.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(newPreviewImages);
  };

  // Remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...(formData.photos || [])];
    updatedPhotos.splice(index, 1);

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });

    // Update preview images
    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index]);
      const updatedPreviews = [...previewImages];
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    }
  };

  // Trigger file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate AI description
  const generateDescription = () => {
    setIsGeneratingDescription(true);

    // Simulate AI processing
    setTimeout(() => {
      const conditionText = conditionOptions.find(c => c.value === formData.condition)?.text || "";
      const generatedDescription = `This is a ${conditionText} ${formData.title || "[item]"}. ${formData.category ? `Perfect for anyone looking for ${formData.category.toLowerCase()} items.` : ""} Local pickup available in ${formData.location || "[your location]"}.`;

      setFormData({
        ...formData,
        description: generatedDescription,
      });

      setIsGeneratingDescription(false);
    }, 1500);
  };

  // Handle coordinates selection from map
  const handleCoordinatesSelected = (locationData) => {
    const { lat, lng, addressData } = locationData;
    
    // บันทึกพิกัด
    setCoordinates({ lat, lng });
    setFormData(prev => ({
      ...prev,
      lat: lat,
      lon: lng
    }));
    
    // บันทึกข้อมูลที่อยู่
    if (addressData) {
      setAddressData(addressData);
      
      // ถ้ามีข้อมูล placeName ให้อัปเดต location
      if (addressData.placeName) {
        // สร้างชื่อสถานที่: "placeName, road" (ถ้ามี road)
        const locationText = addressData.road 
          ? `${addressData.placeName}, ${addressData.road}` 
          : addressData.placeName;
          
        setFormData(prev => ({
          ...prev,
          location: locationText
        }));
      }
    }
  };

  // Helper function to get correct icon
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'fa-couch': return faCouch;
      case 'fa-tshirt': return faTshirt;
      case 'fa-laptop': return faLaptop;
      case 'fa-blender': return faBlender;
      case 'fa-baby': return faBaby;
      case 'fa-book': return faBook;
      case 'fa-utensils': return faUtensils;
      case 'fa-futbol': return faFutbol;
      case 'fa-home': return faHome;
      case 'fa-box': return faBox;
      default: return faThLarge;
    }
  };

  // Function to open map modal
  const openMapModal = () => {
    setShowMapModal(true);
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!isAuthenticated()) {
        router.push('/Auth');
        return;
      }

      // สร้าง FormData object
      const formDataToSend = new FormData();
      
      // เพิ่มรูปภาพ
      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((file) => {
          formDataToSend.append('images', file);
        });
      }

      // เพิ่มข้อมูลอื่นๆ
      const itemData = {
        name: formData.title,
        category: formData.category,
        type: "Donation",
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        uploaded_by: user?.id
      };

      formDataToSend.append('item_data', JSON.stringify(itemData));

      // ส่งข้อมูลไปยัง API
      const response = await api.post('/items/with-images', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      // รีเซ็ตฟอร์มและ redirect
      setFormData({
        title: '',
        category: '',
        condition: '',
        description: '',
        location: '',
        photos: []
      });
      setPreviewImages([]);
      setAddressData(null);
      setSubdistrictId(null);
      router.push('/');
      
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          บริจาคสิ่งของ
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              ชื่อสิ่งของ
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              หมวดหมู่
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              {categoryOptions.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              สภาพ
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleConditionChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">เลือกสภาพ</option>
              {conditionOptions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.text}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              รายละเอียด
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              สถานที่
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              รูปภาพ
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleFiles(files);
              }}
              className="mt-1 block w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              สามารถอัปโหลดได้สูงสุด 5 รูป
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                กำลังส่ง...
              </>
            ) : (
              'ส่งข้อมูล'
            )}
          </button>
        </div>
      </form>
      
      {/* Modal แผนที่ */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">เลือกตำแหน่งบนแผนที่</h3>
              <button 
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowMapModal(false)}
                aria-label="ปิด"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 flex-1">
              <LeafletMap onSelectLocation={handleCoordinatesSelected} />
              
              {addressData && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <p className="text-sm font-medium">ข้อมูลที่อยู่:</p>
                  {addressData.placeName && (
                    <p className="text-gray-700">สถานที่: {addressData.placeName}</p>
                  )}
                  {addressData.road && (
                    <p className="text-gray-700">ถนน: {addressData.road}</p>
                  )}
                  <p className="text-gray-700">
                    {addressData.subdistrict && `ตำบล ${addressData.subdistrict} `}
                    {addressData.district && `อำเภอ ${addressData.district} `}
                    {addressData.province && `จังหวัด ${addressData.province}`}
                  </p>
                  <p className="text-gray-700">พิกัด: {coordinates && `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <button
                type="button"
                className="bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors w-full"
                onClick={() => setShowMapModal(false)}
              >
                ยืนยันตำแหน่ง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationForm;