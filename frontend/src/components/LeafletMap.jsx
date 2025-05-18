"use client";

import React, { useState, useEffect, useRef } from 'react';

const LeafletMap = ({ onSelectLocation = () => {} }) => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const onSelectLocationRef = useRef(onSelectLocation);
  const markerRef = useRef(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  
  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      if (leafletRef.current && markerRef.current) {
        markerRef.current = null;
      }
      
      if (leafletRef.current && leafletRef.current.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  const fetchAddressFromCoordinates = async (lat, lng) => {
    if (!lat || !lng) return null;
    
    setIsAddressLoading(true);
    try {
      const longdo_api_key = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
      if (!longdo_api_key) {
        throw new Error('Longdo Map API key is not defined');
      }

      const response = await fetch(`https://api.longdo.com/map/services/address?lon=${lng}&lat=${lat}&noelevation=1&key=${longdo_api_key}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }
      
      const data = await response.json();
      
      // เตรียมข้อมูลที่จะส่งกลับ
      const addressData = {
        placeName: data.aoi || '',
        road: data.road || '',
        subdistrict: data.subdistrict ? data.subdistrict.replace(/^(แขวง|ตำบล|ต\.)\s*/i, '').trim() : '',
        district: data.district ? data.district.replace(/^(เขต|อำเภอ|อ\.)\s*/i, '').trim() : '',
        province: data.province ? data.province.replace('จ.', '').trim() : '',
        coordinates: { lat, lng },
        rawData: data // ส่งข้อมูลดิบทั้งหมดกลับไปด้วย
      };
      
      return addressData;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    } finally {
      setIsAddressLoading(false);
    }
  };

  // เฉพาะหลัง mount แล้วค่อยโหลด Leaflet และสร้างแผนที่
  useEffect(() => {
    // รอให้ component mount ก่อน
    if (!isMounted || !mapRef.current) return;
    
    // แน่ใจว่าไม่ได้สร้างแผนที่ซ้ำ
    if (leafletRef.current && leafletRef.current.map) return;
    
    // import Leaflet เฉพาะฝั่ง client
    const initMap = async () => {
      try {
        // Dynamic import Leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        // แก้ปัญหาไอคอน
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        // สร้างแผนที่
        const map = L.map(mapRef.current).setView([13.7563, 100.5018], 13);
        
        // เก็บอ้างอิงไว้
        leafletRef.current = { L, map };
        
        // เพิ่ม tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // เพิ่ม event listener
        map.on('click', (e) => {
          handleMapClick(e, L, map);
        });
        
        // พยายามขอตำแหน่งผู้ใช้
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 15);
              
              // ดึงข้อมูลที่อยู่จากพิกัด
              const addressData = await fetchAddressFromCoordinates(latitude, longitude);
              
              // เพิ่มหมุดและส่งข้อมูลกลับ
              addOrUpdateMarker(L, map, latitude, longitude, addressData);
            },
            (error) => {
              console.error("ไม่สามารถขอตำแหน่งได้:", error);
            }
          );
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลด Leaflet:", error);
      }
    };
    
    initMap();
  }, [isMounted]);

  // ฟังก์ชันสำหรับจัดการคลิกบนแผนที่
  const handleMapClick = async (e, L, map) => {
    if (!e || !e.latlng || !L || !map) return;
    
    // ดึงข้อมูลที่อยู่จากพิกัด
    const addressData = await fetchAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
    
    // เพิ่มหมุดและส่งข้อมูลกลับ
    addOrUpdateMarker(L, map, e.latlng.lat, e.latlng.lng, addressData);
  };
  
  // ฟังก์ชันสำหรับเพิ่มหรืออัปเดตหมุด
  const addOrUpdateMarker = (L, map, lat, lng, addressData = null) => {
    if (!L || !map || !lat || !lng) return;
    
    // ลบหมุดเก่าถ้ามี
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    
    // สร้างหมุดใหม่ที่ลากได้
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;
    
    // เรียกใช้ callback เมื่อมีการเลือกตำแหน่ง
    onSelectLocationRef.current({ 
      lat, 
      lng,
      addressData  // ส่งข้อมูลที่อยู่กลับไปด้วย
    });
    
    // เพิ่ม event เมื่อลากหมุดเสร็จ
    marker.on('dragend', async function() {
      const pos = marker.getLatLng();
      if (!pos) return;
      
      // ดึงข้อมูลที่อยู่จากพิกัดใหม่
      const newAddressData = await fetchAddressFromCoordinates(pos.lat, pos.lng);
      
      // ส่งข้อมูลกลับ
      onSelectLocationRef.current({ 
        lat: pos.lat, 
        lng: pos.lng,
        addressData: newAddressData
      });
    });
  };

  // ถ้า client ยังไม่ mount ให้แสดง placeholder
  if (!isMounted) {
    return (
      <div 
        style={{ height: "400px", width: "100%" }}
        className="bg-gray-100 flex items-center justify-center"
      >
        <p className="text-gray-500">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow"
      />
      {isAddressLoading && (
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-md shadow text-sm">
          กำลังดึงข้อมูลที่อยู่...
        </div>
      )}
    </div>
  );
};

export default LeafletMap;