'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faMapMarkerAlt, 
  faPlus, 
  faMinus, 
  faLocationArrow,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const MapView = ({ 
  items = [], 
  loading = false, 
  error = null 
}) => {
  const mapRef = useRef(null);
  const sidebarRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [itemsWithDistance, setItemsWithDistance] = useState([]);
  const [mapZoom, setMapZoom] = useState(12);
  const [leaflet, setLeaflet] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [donationIcon, setDonationIcon] = useState(null);
  const [requestIcon, setRequestIcon] = useState(null);
  const [userIcon, setUserIcon] = useState(null);

  // โหลด Leaflet เฉพาะบน client-side
  useEffect(() => {
    // ตรวจสอบว่าอยู่บน client
    if (typeof window === 'undefined') return;

    // โหลด CSS ของ Leaflet
    import('leaflet/dist/leaflet.css');
    
    // โหลด Leaflet
    import('leaflet').then(L => {
      // กำหนดค่า icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      // สร้าง Icon สำหรับ Donation
      const donIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // สร้าง Icon สำหรับ Request
      const reqIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // สร้าง Icon สำหรับตำแหน่งผู้ใช้ (สีแดง)
      const uIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // เก็บ Leaflet และ icons ไว้ใน state
      setLeaflet(L);
      setDonationIcon(donIcon);
      setRequestIcon(reqIcon);
      setUserIcon(uIcon);
    });
  }, []);

  // ขอตำแหน่งผู้ใช้
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("เกิดข้อผิดพลาดในการขอตำแหน่งผู้ใช้:", error);
        }
      );
    }
  }, []);

  // ปรับเปลี่ยนส่วนการคำนวณระยะทางโดยใช้ Longdo Map API
  useEffect(() => {
    if (!userLocation || !items) return;

    // กรองรายการที่มีพิกัด
    const itemsWithCoordinates = items.filter(item => item?.lat && item?.lon);
    
    // ฟังก์ชัน async สำหรับคำนวณระยะทางทั้งหมด
    const calculateAllDistances = async () => {
      const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
      if (!apiKey) {
        console.error("ไม่พบ API key ของ Longdo Map ในตัวแปรสภาพแวดล้อม");
        return;
      }

      // สร้าง array สำหรับเก็บผลลัพธ์ทั้งหมด
      const results = [];

      // ทำการคำนวณระยะทางสำหรับแต่ละรายการทีละรายการ
      for (const item of itemsWithCoordinates) {
        try {
          const url = `https://api.longdo.com/RouteService/json/route/guide?flat=${userLocation.lat}&flon=${userLocation.lon}&tlat=${item.lat}&tlon=${item.lon}&mode=d&type=25&locale=th&key=${apiKey}`;
          
          const response = await fetch(url);
          const text = await response.text();
          const data = JSON.parse(text);
          
          // ตรวจสอบว่ามีข้อมูลระยะทางหรือไม่
          if (data?.data?.length > 0 && data.data[0]?.distance) {
            // แปลงระยะทางจากเมตรเป็นกิโลเมตร
            const distanceKm = (data.data[0].distance / 1000).toFixed(1);
            
            results.push({
              ...item,
              distance: parseFloat(distanceKm),
              formattedDistance: `${distanceKm} กม.`,
              routeInfo: data.data[0]  // เก็บข้อมูลเส้นทางเพิ่มเติม
            });
          } else {
            // ถ้าหาเส้นทางไม่ได้ ใช้การคำนวณแบบเส้นตรง (Haversine) เป็น fallback
            const haversineDistance = calculateHaversineDistance(
              userLocation.lat, 
              userLocation.lon, 
              item.lat, 
              item.lon
            );
            
            results.push({
              ...item,
              distance: haversineDistance,
              formattedDistance: `${haversineDistance.toFixed(1)} กม. (เส้นตรง)`,
              isHaversine: true
            });
          }
        } catch (error) {
          console.error(`เกิดข้อผิดพลาดในการคำนวณระยะทางสำหรับรายการ ${item?.id}:`, error);
          
          // กรณีเกิด error ใช้การคำนวณแบบเส้นตรง (Haversine) เป็น fallback
          const haversineDistance = calculateHaversineDistance(
            userLocation.lat, 
            userLocation.lon, 
            item.lat, 
            item.lon
          );
          
          results.push({
            ...item,
            distance: haversineDistance,
            formattedDistance: `${haversineDistance.toFixed(1)} กม. (เส้นตรง)`,
            isHaversine: true
          });
        }
      }
      
      // เรียงลำดับตามระยะทางจากน้อยไปมาก
      results.sort((a, b) => a.distance - b.distance);
      
      // อัปเดต state
      setItemsWithDistance(results);
    };

    // ฟังก์ชันคำนวณระยะห่างอย่างง่าย (Haversine formula) - ใช้เป็น fallback
    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // รัศมีของโลกในหน่วย km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // เรียกฟังก์ชันคำนวณระยะทาง
    calculateAllDistances();

  }, [items, userLocation]);

  // สร้างแผนที่เมื่อ Leaflet และ DOM พร้อม
  useEffect(() => {
    // ตรวจสอบว่ามี Leaflet แล้ว, DOM element พร้อม, และยังไม่ได้สร้างแผนที่
    if (!leaflet || !mapRef.current || map || !userIcon) return;

    try {
      // สร้างแผนที่ Leaflet - เริ่มจากตำแหน่งผู้ใช้ หรือ กรุงเทพฯ ถ้าไม่มีตำแหน่งผู้ใช้
      const initialPosition = userLocation 
        ? [userLocation.lat, userLocation.lon] 
        : [13.736717, 100.523186]; // กรุงเทพฯ หรือตำแหน่งผู้ใช้

      console.log("กำลังสร้างแผนที่ด้วยตำแหน่งเริ่มต้น:", initialPosition);
      
      // รอให้ DOM พร้อมด้วย setTimeout เล็กน้อย
      setTimeout(() => {
        try {
          // สร้างแผนที่
          const leafletMap = leaflet.map(mapRef.current).setView(initialPosition, mapZoom);

          // เพิ่ม tile layer
          leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(leafletMap);

          // เพิ่มหมุดแสดงตำแหน่งผู้ใช้ถ้ามี (ใช้ไอคอนสีแดง)
          if (userLocation && userIcon) {
            const um = leaflet.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
              .addTo(leafletMap)
              .bindPopup("<b>คุณอยู่ที่นี่</b>")
              .openPopup();
            
            setUserMarker(um);
          }

          // อัพเดทสถานะ
          setMap(leafletMap);
          setIsMapReady(true);

          // Cleanup เมื่อ unmount
          return () => {
            if (leafletMap) {
              console.log("กำลังลบแผนที่");
              leafletMap.remove();
            }
          };
        } catch (err) {
          console.error("เกิดข้อผิดพลาดในการสร้างแผนที่:", err);
        }
      }, 100);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเตรียมแผนที่:", err);
    }
  }, [leaflet, mapRef.current, map, userLocation, userIcon]);

  // อัพเดท markers เมื่อ items หรือ map เปลี่ยน
  useEffect(() => {
    if (!map || !leaflet || !donationIcon || !requestIcon) return;

    // ลบ markers เก่าทั้งหมด
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    // สร้าง markers ใหม่
    const newMarkers = itemsWithDistance.map(item => {
      if (!item?.lat || !item?.lon) return null;

      const marker = leaflet.marker(
        [item.lat, item.lon],
        { icon: item.type === 'Offer' ? donationIcon : requestIcon }
      ).addTo(map);

      // เพิ่ม popup
      marker.bindPopup(`
        <div>
          <h3 class="font-bold">${item.title || 'ไม่มีชื่อ'}</h3>
          <p>${item.description || 'ไม่มีคำอธิบาย'}</p>
          <p>ระยะทาง: ${item.formattedDistance || 'ไม่สามารถคำนวณได้'}</p>
        </div>
      `);

      // เพิ่ม event listener
      marker.on('click', () => handleItemClick(item));

      return marker;
    }).filter(Boolean);

    setMarkers(newMarkers);
  }, [map, leaflet, itemsWithDistance, donationIcon, requestIcon]);

  const handleItemClick = (item) => {
    if (!item) return;
    setSelectedMarker(item);
  };

  const goToUserLocation = () => {
    if (!map || !userLocation) return;
    map.setView([userLocation.lat, userLocation.lon], mapZoom);
  };

  return (
    <div className="relative h-full">
      {/* แผนที่ */}
      <div ref={mapRef} className="h-full w-full" />

      {/* ปุ่มควบคุม */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => map?.zoomIn()}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          aria-label="ซูมเข้า"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={() => map?.zoomOut()}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          aria-label="ซูมออก"
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <button
          onClick={goToUserLocation}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          aria-label="ไปที่ตำแหน่งของฉัน"
        >
          <FontAwesomeIcon icon={faLocationArrow} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          selectedMarker ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedMarker && (
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedMarker.title || 'ไม่มีชื่อ'}</h2>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="ปิด"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4">
              <p>{selectedMarker.description || 'ไม่มีคำอธิบาย'}</p>
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <span>{selectedMarker.location || 'ไม่ระบุตำแหน่ง'}</span>
              </div>
              <div className="text-gray-600">
                <span>ระยะทาง: {selectedMarker.formattedDistance || 'ไม่สามารถคำนวณได้'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-500 animate-spin" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>เกิดข้อผิดพลาด: {error}</p>
        </div>
      )}
    </div>
  );
};

export default MapView;