"use client"

import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import DonationCard from "./DonationCard";

const DonationList = () => {
  const [viewMode, setViewMode] = useState("grid");

  // Sample donation data
  const donations = [
    {
      id: 1,
      title: "Children's Bicycle",
      category: "Kids & Toys",
      location: "Downtown, Seattle",
      distance: "0.8 miles",
      matchPercentage: 95,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20high-quality%20photograph%20of%20a%20blue%20children%20bicycle%20in%20excellent%20condition%2C%20positioned%20against%20a%20clean%20white%20background.%20The%20bicycle%20has%20training%20wheels%20and%20a%20small%20basket%2C%20perfect%20for%20a%20young%20child%20learning%20to%20ride.%20The%20lighting%20is%20bright%20and%20even%2C%20highlighting%20the%20details%20of%20the%20bike.&width=400&height=300&seq=1&orientation=landscape",
    },
    {
      id: 2,
      title: "Office Desk Chair",
      category: "Furniture",
      location: "Capitol Hill, Seattle",
      distance: "1.2 miles",
      matchPercentage: 87,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20professional%20black%20ergonomic%20office%20chair%20with%20adjustable%20armrests%20and%20lumbar%20support%2C%20photographed%20against%20a%20minimalist%20white%20background.%20The%20chair%20is%20positioned%20at%20a%20slight%20angle%20to%20show%20its%20profile%20and%20features.%20Studio%20lighting%20highlights%20the%20sleek%20design%20and%20fabric%20texture.&width=400&height=300&seq=2&orientation=landscape",
    },
    {
      id: 3,
      title: "Winter Coat (Medium)",
      category: "Clothing",
      location: "Ballard, Seattle",
      distance: "2.5 miles",
      matchPercentage: 92,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20warm%20navy%20blue%20winter%20coat%20with%20fur-lined%20hood%2C%20displayed%20on%20an%20invisible%20mannequin%20against%20a%20clean%20white%20background.%20The%20coat%20has%20multiple%20pockets%20and%20a%20sturdy%20zipper.%20The%20lighting%20is%20bright%20and%20even%2C%20highlighting%20the%20texture%20and%20details%20of%20the%20winter%20garment.&width=400&height=300&seq=3&orientation=landscape",
    },
    {
      id: 4,
      title: "Microwave Oven",
      category: "Appliances",
      location: "Fremont, Seattle",
      distance: "1.7 miles",
      matchPercentage: 78,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20modern%20stainless%20steel%20microwave%20oven%20photographed%20straight-on%20against%20a%20clean%20white%20background.%20The%20microwave%20has%20a%20digital%20display%20and%20several%20control%20buttons.%20The%20lighting%20is%20bright%20and%20even%2C%20highlighting%20the%20sleek%20metallic%20finish%20and%20clean%20design%20of%20the%20appliance.&width=400&height=300&seq=4&orientation=landscape",
    },
    {
      id: 5,
      title: "Baby Stroller",
      category: "Kids & Toys",
      location: "Queen Anne, Seattle",
      distance: "3.2 miles",
      matchPercentage: 89,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20modern%20lightweight%20baby%20stroller%20in%20dark%20gray%20and%20black%20colors%2C%20photographed%20against%20a%20clean%20white%20background.%20The%20stroller%20has%20a%20canopy%2C%20storage%20basket%20underneath%2C%20and%20safety%20harness.%20The%20lighting%20is%20bright%20and%20even%2C%20highlighting%20the%20practical%20design%20and%20fabric%20texture.&width=400&height=300&seq=5&orientation=landscape",
    },
    {
      id: 6,
      title: "Bookshelf",
      category: "Furniture",
      location: "University District, Seattle",
      distance: "2.1 miles",
      matchPercentage: 83,
      imageUrl:
        "https://readdy.ai/api/search-image?query=A%20wooden%20bookshelf%20with%20five%20shelves%2C%20photographed%20straight-on%20against%20a%20clean%20white%20background.%20The%20bookshelf%20is%20made%20of%20warm%20oak%20wood%20with%20a%20natural%20finish.%20The%20lighting%20is%20bright%20and%20even%2C%20highlighting%20the%20grain%20of%20the%20wood%20and%20the%20sturdy%20construction%20of%20the%20furniture%20piece.&width=400&height=300&seq=6&orientation=landscape",
    },
  ];

  // Initialize map when view mode changes to map
  useEffect(() => {
    if (viewMode === "map") {
      const mapChart = echarts.init(document.getElementById("map-container"));
      const option = {
        animation: false,
        backgroundColor: "#f8fafc",
        geo: {
          map: "seattle",
          roam: true,
          center: [-122.3321, 47.6062],
          zoom: 12,
          itemStyle: {
            areaColor: "#f1f5f9",
            borderColor: "#cbd5e1",
            borderWidth: 0.5,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#e2e8f0",
            },
          },
        },
        series: [
          {
            name: "Donations",
            type: "scatter",
            coordinateSystem: "geo",
            data: [
              { value: [-122.3321, 47.6062, 10], name: "Downtown" },
              { value: [-122.3221, 47.6232, 8], name: "Capitol Hill" },
              { value: [-122.3866, 47.6792, 12], name: "Ballard" },
              { value: [-122.35, 47.65, 7], name: "Fremont" },
              { value: [-122.3566, 47.6344, 9], name: "Queen Anne" },
              { value: [-122.3132, 47.6615, 11], name: "University District" },
            ],
            symbolSize: 15,
            itemStyle: {
              color: "#10b981",
            },
            emphasis: {
              itemStyle: {
                color: "#059669",
                borderColor: "#fff",
                borderWidth: 2,
              },
            },
            label: {
              show: false,
            },
          },
          {
            name: "Requests",
            type: "scatter",
            coordinateSystem: "geo",
            data: [
              { value: [-122.3401, 47.6102, 5], name: "Downtown Request" },
              { value: [-122.3271, 47.6252, 7], name: "Capitol Hill Request" },
              { value: [-122.3916, 47.6742, 4], name: "Ballard Request" },
              { value: [-122.355, 47.652, 6], name: "Fremont Request" },
            ],
            symbolSize: 15,
            itemStyle: {
              color: "#3b82f6",
            },
            emphasis: {
              itemStyle: {
                color: "#2563eb",
                borderColor: "#fff",
                borderWidth: 2,
              },
            },
            label: {
              show: false,
            },
          },
        ],
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return params.name + "<br/>Items: " + params.value[2];
          },
        },
      };
      
      // Set up mock map data
      echarts.registerMap("seattle", {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Seattle" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-122.4, 47.5],
                  [-122.2, 47.5],
                  [-122.2, 47.7],
                  [-122.4, 47.7],
                  [-122.4, 47.5],
                ],
              ],
            },
          },
        ],
      });
      
      mapChart.setOption(option);
      
      const handleResize = () => {
        mapChart.resize();
      };
      
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        mapChart.dispose();
      };
    }
  }, [viewMode]);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Available Donations
      </h2>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: "600px" }}>
          <div id="map-container" className="w-full h-full"></div>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
          Load More
        </button>
      </div>
    </main>
  );
};

export default DonationList;