"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

const LeafletMap = ({
  center = [13.7563, 100.5018], // กรุงเทพฯ
  zoom = 13,
  markers = [],
  onMarkerClick = () => {},
  onMapClick = () => {},
  height = '400px',
  className = '',
  loading = false
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // สร้าง map instance ถ้ายังไม่มี
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // เพิ่ม tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // เพิ่ม event listener สำหรับการคลิกที่แผนที่
      mapInstanceRef.current.on('click', (e) => {
        if (onMapClick) {
          onMapClick(e.latlng);
        }
      });
    }

    // ลบ markers เก่าทั้งหมด
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // เพิ่ม markers ใหม่
    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        if (!marker || !marker.position) return;

        const newMarker = L.marker(marker.position)
          .addTo(mapInstanceRef.current)
          .bindPopup(marker.popup || 'ไม่ระบุข้อมูล');

        if (onMarkerClick) {
          newMarker.on('click', () => onMarkerClick(marker));
        }

        markersRef.current.push(newMarker);
      });
    }

    // ปรับ view ให้แสดง markers ทั้งหมด
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers, onMarkerClick, onMapClick]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-indigo-600" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LeafletMap;