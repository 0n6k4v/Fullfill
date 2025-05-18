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
    
    // ตรวจสอบสถานะการล็อกอินก่อน
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Prepare item data
      const itemData = {
        name: formData.title,
        category: formData.category,
        type: "Offer",
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        uploaded_by: user.id,
        lat: formData.lat,
        lon: formData.lon,
        status: "available"
      };
      
      // ถ้ามี subdistrict_id ให้ใช้ subdistrict_id
      if (formData.subdistrict_id) {
        itemData.subdistrict_id = formData.subdistrict_id;
        console.log("ส่งข้อมูลด้วย subdistrict_id:", formData.subdistrict_id);
      } 
      // ถ้าไม่มี ID ให้ส่งข้อมูลชื่อตำบล อำเภอ จังหวัด แทน
      else if (formData.subdistrict_name) {
        itemData.location_info = {
          subdistrict: formData.subdistrict_name,
          district: formData.district_name,
          province: formData.province_name
        };
        console.log("ส่งข้อมูลด้วย location_info:", itemData.location_info);
      }
      
      // Add photos to FormData
      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((file) => {
          formDataToSend.append(`images`, file);
        });
      }
      
      // Add item data as JSON string
      formDataToSend.append('item_data', JSON.stringify(itemData));
      
      // ใช้ api service แทนการเรียก axios โดยตรง
      const response = await api.post('/items/with-images', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Item created:", response.data);
      
      // Reset form or redirect
      alert("Item successfully posted!");
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        condition: "",
        description: "",
        location: "",
        photos: [],
        type: "Offer",
        lat: null,
        lon: null,
        subdistrict_id: null,
        subdistrict_name: null,
        district_name: null,
        province_name: null
      });
      setPreviewImages([]);
      setAddressData(null);
      setSubdistrictId(null);
      
    } catch (error) {
      console.error("Error creating item:", error);
      
      if (error.response && error.response.status === 401) {
        setShowLoginModal(true);
      } else {
        alert("Failed to create item. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* ชื่อสิ่งของ */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            ชื่อสิ่งของ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="เช่น โต๊ะอาหารไม้ เสื้อกันหนาว"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          />
        </div>

        {/* หมวดหมู่ */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            หมวดหมู่ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span className="flex items-center">
                {formData.category ? (
                  <>
                    <FontAwesomeIcon 
                      icon={getCategoryIcon(categoryOptions.find((c) => c.name === formData.category)?.icon || "fa-th-large")} 
                      className="mr-2 text-blue-500" 
                    />
                    {formData.category}
                  </>
                ) : (
                  "เลือกหมวดหมู่"
                )}
              </span>
              <FontAwesomeIcon 
                icon={isCategoryDropdownOpen ? faChevronUp : faChevronDown} 
                className="text-gray-400" 
              />
            </button>
            {isCategoryDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {categoryOptions.map((category) => (
                  <div
                    key={category.name}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <FontAwesomeIcon 
                      icon={getCategoryIcon(category.icon)} 
                      className="mr-2 text-blue-500 w-5" 
                    />
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* สภาพสิ่งของ */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            สภาพสิ่งของ <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col space-y-2">
            {conditionOptions.map((condition) => (
              <div key={condition.value} className="flex items-center">
                <input
                  type="radio"
                  id={`condition-${condition.value}`}
                  name="condition"
                  value={condition.value}
                  checked={formData.condition === condition.value}
                  onChange={() => handleConditionChange(condition.value)}
                  className="mr-2"
                />
                <label htmlFor={`condition-${condition.value}`} className="text-gray-700">
                  {condition.text}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* คำอธิบาย */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium"
            >
              คำอธิบาย <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGeneratingDescription}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {isGeneratingDescription ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-1" />
                  กำลังสร้าง...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagic} className="mr-1" />
                  สร้างด้วย AI
                </>
              )}
            </button>
          </div>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="อธิบายรายละเอียด สภาพ และข้อมูลอื่นๆ ที่เกี่ยวข้อง..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={5}
            required
          ></textarea>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              ให้รายละเอียดที่ชัดเจนเพื่อให้ผู้อื่นเข้าใจสิ่งที่คุณต้องการบริจาค
            </span>
            <span>{(formData.description || "").length}/500</span>
          </div>
        </div>

        {/* สถานที่ */}
        <div className="mb-6">
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            สถานที่ <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                placeholder="เช่น ตัวเมือง, กรุงเทพฯ"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              <FontAwesomeIcon 
                icon={faMapMarkerAlt} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" 
              />
            </div>
            <button
              type="button"
              onClick={openMapModal}
              className="flex items-center px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FontAwesomeIcon icon={faMapLocation} className="mr-2" />
              เลือกบนแผนที่
            </button>
          </div>
          
          {addressData && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p><span className="font-medium">ตำแหน่ง:</span> {coordinates && `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`}</p>
              {addressData.subdistrict && (
                <p>
                  <span className="font-medium">ที่อยู่:</span> 
                  {addressData.subdistrict && ` ต.${addressData.subdistrict}`}
                  {addressData.district && ` อ.${addressData.district}`}
                  {addressData.province && ` จ.${addressData.province}`}
                </p>
              )}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            เพื่อความปลอดภัย กรุณาระบุพื้นที่ทั่วไปแทนที่อยู่ที่แน่นอน
          </p>
        </div>

        {/* อัพโหลดรูปภาพ */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            รูปภาพ <span className="text-gray-500">(สูงสุด 5 รูป)</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <FontAwesomeIcon 
              icon={faCloudUploadAlt} 
              className="text-4xl text-blue-500 mb-3" 
            />
            <p className="text-gray-700 mb-1">
              ลากและวางรูปภาพที่นี่
            </p>
            <p className="text-gray-500 text-sm mb-2">
              หรือคลิกเพื่อเลือกไฟล์
            </p>
            <button
              type="button"
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              เลือกรูปภาพ
            </button>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                รูปภาพที่อัพโหลด:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`รูปภาพ ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="ลบรูปภาพ"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มส่ง */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                กำลังส่ง...
              </>
            ) : (
              "ส่งการบริจาค"
            )}
          </button>
        </div>

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
      </form>
      
      {/* Modal เข้าสู่ระบบ */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-3">โปรดเข้าสู่ระบบ</h3>
            <p className="text-gray-600 mb-4">คุณจำเป็นต้องเข้าสู่ระบบก่อนจึงจะสามารถบริจาคสิ่งของได้</p>
            <div className="flex space-x-3">
              <button
                type="button"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors"
                onClick={() => window.location.href = '/Auth'}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setShowLoginModal(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationForm;