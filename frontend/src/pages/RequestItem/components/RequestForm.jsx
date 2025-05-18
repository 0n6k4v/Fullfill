'use client'

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronUp, faChevronDown, faThLarge, faMapMarkerAlt,
  faSpinner, faLightbulb, faCloudUploadAlt, faTimes,
  faCouch, faTshirt, faLaptop, faBlender, faBaby,
  faBook, faUtensils, faFutbol, faHome, faBox, faStar as fasStar,
  faMapLocation, faCheckCircle, faClock
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../context/AuthContext';
import api from "@/services/api";

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'), 
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">กำลังโหลดแผนที่...</div>
  }
);

const RequestForm = ({ 
  formData, 
  setFormData, 
  setErrors, 
  errors, 
  files, 
  setFiles,
  updateFormProgress
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showTips, setShowTips] = useState(true);
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
  const [previewImages, setPreviewImages] = useState([]);
  
  // Set category and condition options
  useEffect(() => {
    // Default categories
    setCategoryOptions([
      { name: "Furniture", icon: "fa-couch" },
      { name: "Clothing", icon: "fa-tshirt" },
      { name: "Electronics", icon: "fa-laptop" },
      { name: "Appliances", icon: "fa-blender" },
      { name: "Kids & Toys", icon: "fa-baby" },
      { name: "Books", icon: "fa-book" },
      { name: "Kitchen", icon: "fa-utensils" },
      { name: "Other", icon: "fa-box" },
    ]);
    
    // Set condition options
    setConditionOptions([
      { value: "Poor", text: "Poor" },
      { value: "Fair", text: "Fair" },
      { value: "Good", text: "Good" },
      { value: "Like_New", text: "Like New" },
      { value: "New", text: "New" }
    ]);
  }, []);

  // ดึงข้อมูลตำบลจาก API เมื่อมีการเลือกตำแหน่งบนแผนที่
  useEffect(() => {
    if (addressData && addressData.subdistrict && addressData.district && addressData.province) {
      // ถ้ามีข้อมูลสถานที่ ให้ใส่ในฟิลด์ location
      if (addressData.placeName) {
        setFormData(prev => ({
          ...prev,
          location: addressData.placeName
        }));
      }
      
      // ดึง subdistrict ID จาก API
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
            
            // ใช้ตำบลแรกในอำเภอนั้นแทน
            if (subdistrictsResponse.data.length > 0) {
              const firstSubdistrict = subdistrictsResponse.data[0];
              console.log("ใช้ตำบลแรกแทน:", firstSubdistrict.subdistrict_name);
              setSubdistrictId(firstSubdistrict.id);
              setFormData(prev => ({
                ...prev,
                subdistrict_id: firstSubdistrict.id,
                province_id: province.id,
                province_name: province.province_name,
                district_id: district.id,
                district_name: district.district_name,
                subdistrict_name: firstSubdistrict.subdistrict_name
              }));
              return;
            }
            
            throw new Error(`ไม่พบตำบล: ${addressData.subdistrict}`);
          }
          
          console.log("พบตำบล:", subdistrict.subdistrict_name, "ID:", subdistrict.id);
          
          // บันทึก subdistrict ID
          setSubdistrictId(subdistrict.id);
          
          // เพิ่ม subdistrict_id เข้าไปในฟอร์ม
          setFormData(prev => ({
            ...prev,
            subdistrict_id: subdistrict.id,
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

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Update form progress
    updateFormProgress();
  };

  // Handle condition rating change
  const handleConditionChange = (condition) => {
    // แปลงเป็นค่าตามดาวที่เลือก
    let conditionValue;
    switch(condition) {
      case 1: conditionValue = "Poor"; break;
      case 2: conditionValue = "Fair"; break;
      case 3: conditionValue = "Good"; break;
      case 4: conditionValue = "Like_New"; break;
      case 5: conditionValue = "New"; break;
      default: conditionValue = "";
    }
    
    setFormData({
      ...formData,
      condition: conditionValue,
      conditionStars: condition // เก็บจำนวนดาวไว้แสดงผล
    });
    
    // Update form progress
    updateFormProgress();
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category,
    });
    setIsCategoryDropdownOpen(false);

    // Clear error when field is updated
    if (errors.category) {
      setErrors({
        ...errors,
        category: "",
      });
    }

    // Update form progress
    updateFormProgress();
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
    
    // Set files for compatibility with existing code
    if (setFiles) {
      setFiles(updatedPhotos);
    }

    // Generate preview URLs
    const newPreviewImages = updatedPhotos.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(newPreviewImages);
    
    // Update form progress
    updateFormProgress();
  };

  // Remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...(formData.photos || [])];
    updatedPhotos.splice(index, 1);

    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
    
    // Update files array if it exists
    if (setFiles) {
      setFiles(updatedPhotos);
    }

    // Update preview images
    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index]);
      const updatedPreviews = [...previewImages];
      updatedPreviews.splice(index, 1);
      setPreviewImages(updatedPreviews);
    }
    
    // Update form progress
    updateFormProgress();
  };

  // Trigger file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
    
    // Clear location error if it exists
    if (errors.location) {
      setErrors({
        ...errors,
        location: "",
      });
    }
    
    // Update form progress
    updateFormProgress();
  };

  // Function to open map modal
  const openMapModal = () => {
    setShowMapModal(true);
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

  // เพิ่มการ validate ที่รัดกุมขึ้น
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName || !formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.condition) {
      newErrors.condition = "Please select condition";
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // ตรวจสอบว่ามี user หรือไม่ ป้องกัน error
      if (!user || !user.id) {
        alert("Cannot submit: User information not found. Please try logging in again.");
        setIsSubmitting(false);
        return;
      }
      
      // ฟังก์ชันแปลงค่า category
      const mapCategoryToBackend = (uiCategory) => {
        const categoryMap = {
          "Furniture": "furniture",
          "Clothing": "clothing",
          "Electronics": "electronics",
          "Appliances": "appliances",
          "Kids & Toys": "kids_toys",
          "Books": "books",
          "Kitchen": "kitchen",
          "Other": "other"
        };
        
        return categoryMap[uiCategory] || "other";
      };
      
      // Prepare item data
      const itemData = {
        name: formData.itemName,
        category: mapCategoryToBackend(formData.category), // แปลงค่า category ก่อนส่งไป API
        type: "Request",
        condition: formData.condition,
        description: formData.description,
        location: formData.location,
        uploaded_by: user.id,
        status: "available"
      };
      
      // เพิ่ม lat/lon เฉพาะเมื่อมีค่า
      if (formData.lat && formData.lon) {
        itemData.lat = formData.lat;
        itemData.lon = formData.lon;
      }
      
      // ถ้ามี subdistrict_id ให้ใช้ subdistrict_id
      if (formData.subdistrict_id) {
        itemData.subdistrict_id = formData.subdistrict_id;
        console.log("ส่งข้อมูลด้วย subdistrict_id:", formData.subdistrict_id);
      } 
      
      // Log ข้อมูลที่จะส่งเพื่อดูว่ามีปัญหาตรงไหน
      console.log("Sending item data:", itemData);
      
      // Add item data as JSON string
      formDataToSend.append('item_data', JSON.stringify(itemData));
      
      // Add photos to FormData - แก้ไขการตรวจสอบไฟล์
      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((file, index) => {
          // ตรวจสอบว่าเป็น File object จริงๆ
          if (file instanceof File) {
            formDataToSend.append(`images`, file);
            console.log(`Adding image ${index}: ${file.name}, size: ${file.size}`);
          } else {
            console.error(`Invalid file at index ${index}:`, file);
          }
        });
      }
      
      // ใช้ api service ส่งข้อมูล พร้อม log ข้อมูลที่ส่ง
      console.log("Sending data to API...");
      const response = await api.post('/items/with-images', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Request item created:", response.data);
      
      // Reset form or redirect
      alert("Request successfully submitted!");
      
      // Reset form
      setFormData({
        itemName: "",
        title: "",
        category: "",
        condition: "",
        description: "",
        location: "",
        photos: [],
        type: "Request",
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
      if (setFiles) {
        setFiles([]);
      }
      
    } catch (error) {
      console.error("Error creating request item:", error);
      
      // แสดงข้อมูลข้อผิดพลาดละเอียดขึ้น
      if (error.response) {
        console.error("Error details:", error.response.data);
        alert(`Submission failed: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Item Title */}
        <div className="mb-6">
          <label
            htmlFor="itemName"
            className="block text-gray-700 font-medium mb-2"
          >
            Item Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName || ""}
            onChange={handleInputChange}
            placeholder="e.g., Office Desk, Winter Coat, Kitchen Blender"
            className={`w-full px-4 py-3 rounded-lg border ${errors.itemName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
            required
          />
          {errors.itemName && (
            <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
          )}
        </div>

        {/* Category Selection - แบบ Grid UI เก่า */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Category <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                  formData.category === category.name 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-300 hover:bg-gray-50"
                } transition-colors`}
              >
                <FontAwesomeIcon 
                  icon={getCategoryIcon(category.icon)} 
                  className={`text-2xl mb-2 ${formData.category === category.name ? "text-blue-500" : "text-gray-500"}`} 
                />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Describe the item you're looking for, including specific features, size, color, etc."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={5}
            required
          ></textarea>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              Be specific to help others understand what you need
            </span>
            <span>{(formData.description || "").length}/500</span>
          </div>
        </div>

        {/* Condition Selection - แบบเลือกเป็นดาว */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Minimum Condition <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleConditionChange(star)}
                className="text-2xl focus:outline-none"
              >
                <FontAwesomeIcon
                  icon={star <= (formData.conditionStars || 0) ? fasStar : farStar}
                  className={star <= (formData.conditionStars || 0) ? "text-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {formData.condition ? conditionOptions.find(c => c.value === formData.condition)?.text : "Select condition"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select the minimum acceptable condition for the item you're requesting
          </p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                placeholder="e.g., Downtown, Seattle"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.location ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
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
              Pick on Map
            </button>
          </div>
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
          
          {/* แสดงข้อมูลที่อยู่ที่ได้จาก API */}
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
            For safety, provide a general area rather than your exact address
          </p>
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Reference Photos <span className="text-gray-500">(Up to 5)</span>
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
              Drag and drop reference photos here
            </p>
            <p className="text-gray-500 text-sm mb-2">
              or click to browse files
            </p>
            <button
              type="button"
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              Select Photos
            </button>
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                Uploaded Photos:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mb-10 bg-blue-50 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-blue-100 cursor-pointer"
            onClick={() => setShowTips(!showTips)}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mr-2" />
              <h3 className="font-medium text-blue-800">
                Tips for a successful request
              </h3>
            </div>
            <FontAwesomeIcon icon={showTips ? faChevronUp : faChevronDown} className="text-blue-800" />
          </div>

          {showTips && (
            <div className="p-4">
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                  <span>
                    <strong>Be specific:</strong> Clearly describe the item
                    you need, including size, color, and other important
                    details.
                  </span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                  <span>
                    <strong>Add photos:</strong> Include reference images to
                    help donors understand exactly what you're looking for.
                  </span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-2" />
                  <span>
                    <strong>Explain why:</strong> Sharing why you need the
                    item can help motivate potential donors.
                  </span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faClock} className="text-amber-500 mt-1 mr-2" />
                  <span>
                    <strong>Expected timeframes:</strong> Most requests are
                    matched within 1-2 weeks, but this can vary based on
                    item availability.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons - ตัดปุ่ม Save Draft ออกเหลือแค่ Submit */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 mt-8">
          <div className="max-w-3xl mx-auto flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md !rounded-button whitespace-nowrap cursor-pointer w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>

        {/* Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Location on Map</h3>
                <button 
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowMapModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="p-4 flex-1">
                {/* ใช้ component แผนที่แบบ dynamic */}
                <LeafletMap onSelectLocation={handleCoordinatesSelected} />
                
                {/* แสดงข้อมูลที่อยู่ */}
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
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default RequestForm;