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

const MapView = ({ items, loading, error }) => {
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
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // ปรับเปลี่ยนส่วนการคำนวณระยะทางโดยใช้ Longdo Map API
  useEffect(() => {
    if (!userLocation || !items) return;

    // กรองรายการที่มีพิกัด
    const itemsWithCoordinates = items.filter(item => item.lat && item.lon);
    
    // ฟังก์ชัน async สำหรับคำนวณระยะทางทั้งหมด
    const calculateAllDistances = async () => {
      const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
      if (!apiKey) {
        console.error("Longdo Map API key not found in environment variables");
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
          if (data && data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].distance) {
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
          console.error(`Error calculating distance for item ${item.id}:`, error);
          
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

      console.log("Creating map with initial position:", initialPosition);
      
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
              console.log("Removing map");
              leafletMap.remove();
            }
          };
        } catch (err) {
          console.error("Error creating map:", err);
        }
      }, 50);
    } catch (error) {
      console.error("Error in map creation useEffect:", error);
    }
  }, [leaflet, mapRef.current, userLocation, mapZoom, userIcon]);

  // ฟังก์ชันสำหรับคลิกที่รายการใน sidebar
  const handleItemClick = (item) => {
    if (!isMapReady || !map) return;
    
    // ตั้งค่า selected marker
    setSelectedMarker(item.id);
    
    // เคลื่อนแผนที่ไปที่ตำแหน่งของรายการ
    if (item.lat && item.lon) {
      map.setView([item.lat, item.lon], 15);
      
      // หา marker ที่ตรงกับไอเทมที่เลือกเพื่อทำ visual effect
      const selectedItemMarker = markers.find(marker => {
        const position = marker.getLatLng();
        return Math.abs(position.lat - item.lat) < 0.0001 && 
               Math.abs(position.lng - item.lon) < 0.0001;
      });
      
      if (selectedItemMarker) {
        // อาจจะเพิ่ม visual effect ให้ marker ที่เลือก เช่น เพิ่ม animation หรือ highlight
        // ตัวอย่าง: ทำให้ marker เด้งขึ้นลงเล็กน้อย
        try {
          selectedItemMarker._icon.classList.add('marker-selected');
          setTimeout(() => {
            if (selectedItemMarker._icon) {
              selectedItemMarker._icon.classList.remove('marker-selected');
            }
          }, 1500);
        } catch (error) {
          console.error("Error highlighting marker:", error);
        }
      }
    }
  };

  // เพิ่มมาร์กเกอร์เมื่อมีข้อมูลและแผนที่พร้อม
  useEffect(() => {
    if (!isMapReady || !map || !leaflet || !donationIcon || !requestIcon || 
        !itemsWithDistance || itemsWithDistance.length === 0) {
      console.log("Not ready to add markers yet");
      return;
    }

    // ต้องรอให้แผนที่พร้อมจริงๆ ก่อนเพิ่ม marker
    // ใช้ timeout เล็กน้อยเพื่อให้ DOM render เสร็จสมบูรณ์
    const addMarkersTimeout = setTimeout(() => {
      try {
        // ลบมาร์กเกอร์เก่า
        console.log("Clearing old markers:", markers.length);
        markers.forEach(marker => {
          if (marker && marker.remove) {
            marker.remove();
          }
        });
        setMarkers([]);

        // สร้างมาร์กเกอร์ใหม่
        console.log("Adding new markers:", itemsWithDistance.length);
        const newMarkers = [];

        for (const item of itemsWithDistance) {
          // ข้ามถ้าไม่มีพิกัด
          if (!item.lat || !item.lon) continue;

          try {
            // เลือกไอคอนตามประเภท
            const icon = item.type === 'Offer' ? donationIcon : requestIcon;

            // สร้างมาร์กเกอร์ - ไม่ใช้ bindPopup แล้ว
            const marker = leaflet.marker([item.lat, item.lon], { icon })
              .addTo(map)
              .on('click', () => {
                // เลือกรายการนี้
                setSelectedMarker(item.id);
                
                // เลื่อน sidebar ไปที่รายการนี้และเน้นรายการ
                const sidebarItem = document.getElementById(`sidebar-item-${item.id}`);
                if (sidebarItem && sidebarRef.current) {
                  // ลบ highlight เดิม
                  const prevHighlighted = document.querySelectorAll('.highlight-item');
                  prevHighlighted.forEach(el => el.classList.remove('highlight-item', 'bg-indigo-100'));
                  
                  // เพิ่ม highlight อันใหม่
                  sidebarItem.classList.add('highlight-item', 'bg-indigo-100');
                  
                  // เลื่อนไปที่รายการ
                  sidebarRef.current.scrollTop = sidebarItem.offsetTop - sidebarRef.current.offsetTop - 10;
                }
              });

            newMarkers.push(marker);
          } catch (error) {
            console.error("Error adding marker:", error);
          }
        }

        setMarkers(newMarkers);

        // ปรับ view ให้เห็นทุกมาร์กเกอร์ ถ้ามีมากกว่า 1 อัน
        if (newMarkers.length > 1) {
          try {
            const group = new leaflet.featureGroup(newMarkers);
            
            // เพิ่ม user marker เข้าไปใน group ถ้ามี
            if (userMarker) {
              group.addLayer(userMarker);
            }
            
            map.fitBounds(group.getBounds().pad(0.1));
          } catch (error) {
            console.error("Error fitting bounds:", error);
          }
        } else if (newMarkers.length === 1 && itemsWithDistance[0]) {
          map.setView([itemsWithDistance[0].lat, itemsWithDistance[0].lon], 13);
        } else if (userLocation) {
          // ถ้าไม่มี marker แต่มีตำแหน่งผู้ใช้
          map.setView([userLocation.lat, userLocation.lon], 13);
        }
      } catch (error) {
        console.error("Error in marker useEffect:", error);
      }
    }, 100); // รอ 100ms เพื่อให้ DOM พร้อม

    return () => clearTimeout(addMarkersTimeout);
  }, [isMapReady, map, leaflet, donationIcon, requestIcon, itemsWithDistance, userMarker]);

  // อัพเดท zoom level เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (map && isMapReady) {
      map.setZoom(mapZoom);
    }
  }, [mapZoom, map, isMapReady]);

  // ย้ายไปที่ตำแหน่งผู้ใช้
  const goToUserLocation = () => {
    if (map && userLocation && isMapReady) {
      map.setView([userLocation.lat, userLocation.lon], 15);
      
      // เปิด popup ของตำแหน่งผู้ใช้ถ้ามี
      if (userMarker) {
        userMarker.openPopup();
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex justify-center items-center">
        <FontAwesomeIcon icon={faSpinner} className="text-indigo-500 text-4xl animate-spin" />
        <span className="ml-3 text-lg text-gray-600">กำลังโหลดแผนที่...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex justify-center items-center flex-col">
        <div className="text-red-500 text-xl mb-4">มีข้อผิดพลาดในการโหลดแผนที่</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* CSS Styles (คงเดิม) */
      /* <style jsx global>{`
        // ... (CSS animations and styles) ...
      `}</style> */}
      
      <div className="flex h-[calc(100vh-240px)] min-h-[600px] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {/* Map (คงเดิม) */}
        <div className="w-2/3 h-full relative">
          <div ref={mapRef} className="w-full h-full"></div>
          {!isMapReady && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
              <FontAwesomeIcon icon={faSpinner} className="text-indigo-500 text-4xl animate-spin" />
              <span className="ml-3">กำลังโหลดแผนที่...</span>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div ref={sidebarRef} className="w-1/3 h-full overflow-y-auto border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <h2 className="text-lg font-medium text-gray-900">
              {itemsWithDistance.length} รายการใกล้คุณ
            </h2>
            <p className="text-sm text-gray-500">
              {selectedMarker ? "รายละเอียดรายการที่เลือก" : "คลิกที่รายการหรือหมุดเพื่อดูรายละเอียด"}
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {itemsWithDistance.map((item) => (
              <div
                id={`sidebar-item-${item.id}`}
                key={item.id}
                className={`p-4 cursor-pointer transition-all duration-300 ease-in-out 
                  ${selectedMarker === item.id ? "bg-indigo-50 border-l-4 border-indigo-500 shadow-lg" : "hover:bg-gray-50"}`}
                onClick={() => handleItemClick(item)}
              >
                {/* Summary View (แสดงเสมอ) */}
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={item.image || '/placeholder-image.png'} // เพิ่ม placeholder
                      alt={item.name || 'รายการ'}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }} // Fallback image
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium break-words ${
                          item.type === "Offer"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.type === "Offer" ? "บริจาค" : "ขอรับบริจาค"}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {item.isHaversine ? (
                          <span title="คำนวณด้วยระยะทางเส้นตรง" className="flex items-center">
                            <span>{item.formattedDistance}</span>
                            <svg className="ml-1 h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        ) : (
                          <span title="คำนวณด้วยระยะทางจริงตามถนน">{item.formattedDistance}</span>
                        )}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mt-1 break-words">
                      {item.name}
                    </h3>
                    {/* แสดง description สั้นๆ ถ้าไม่ได้ถูกเลือก หรือถ้าถูกเลือกแต่ไม่มีรายละเอียดอื่น */}
                    {selectedMarker !== item.id && (
                       <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
                         {item.description}
                       </p>
                    )}
                  </div>
                </div>

                {/* Detailed View (แสดงเมื่อ item นี้ถูกเลือก) */}
                {selectedMarker === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">รายละเอียดเพิ่มเติม:</h4>
                    
                    <p className="text-sm text-gray-700 mb-3 break-words whitespace-pre-wrap">
                      {item.description}
                    </p>

                    {item.lat && item.lon && (
                      <div className="text-xs text-gray-500 mb-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-red-500" />
                        <span>{item.location || `${item.lat.toFixed(4)}, ${item.lon.toFixed(4)}`}</span>
                        {item.isHaversine && (
                          <span className="ml-1 text-amber-600" title="ระยะทางคำนวณแบบเส้นตรง">(เส้นตรง)</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                          หมวดหมู่: {item.category}
                        </span>
                      )}
                      {item.condition && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                          สภาพ: {item.condition}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-1" />
                      <span>โดย: {item.uploaded_by ? `User #${item.uploaded_by}` : "Anonymous User"}</span>
                      <span className="mx-1">•</span>
                      <span>เมื่อ: {new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>

                    <button
                      className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                        item.type === "Offer"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      // onClick={() => {/* เพิ่ม action ที่ต้องการ เช่น เปิดหน้าใหม่ หรือ form */} }
                    >
                      {item.type === "Offer" ? "สนใจรับบริจาค" : "ต้องการช่วยเหลือ"}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {itemsWithDistance.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                {userLocation ? (
                  <>ไม่พบรายการใกล้คุณในขณะนี้</>
                ) : (
                  <>กำลังรอข้อมูลตำแหน่งของคุณ...</>
                )}
              </div>
            )}
            {loading && itemsWithDistance.length === 0 && (
                 <div className="p-8 text-center text-gray-500">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> กำลังโหลดรายการ...
                 </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Controls (คงเดิม) */}
      <div className="flex justify-between mt-4 px-1">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">การบริจาค</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">คำขอรับบริจาค</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">ตำแหน่งของคุณ</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => setMapZoom((prev) => Math.min(prev + 1, 18))}
            disabled={!isMapReady}
          >
            <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
          </button>
          <button
            className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => setMapZoom((prev) => Math.max(prev - 1, 8))}
            disabled={!isMapReady}
          >
            <FontAwesomeIcon icon={faMinus} className="text-gray-600" />
          </button>
          <button 
            className="bg-white border border-gray-300 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
            onClick={goToUserLocation}
            disabled={!isMapReady || !userLocation}
            title="ไปยังตำแหน่งของคุณ"
          >
            <FontAwesomeIcon icon={faLocationArrow} className="text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MapView;