import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const UserActivityChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // User Activity Chart
    if (chartRef.current) {
      const activityChart = echarts.init(chartRef.current);
      const activityOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Donations", "Requests"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Jan", "Feb", "Mar", "Apr", "May"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Donations",
            type: "line",
            data: [3, 2, 4, 1, 2],
            itemStyle: { color: "#10B981" },
          },
          {
            name: "Requests",
            type: "line",
            data: [1, 1, 2, 0, 1],
            itemStyle: { color: "#3B82F6" },
          },
        ],
      };
      activityChart.setOption(activityOption);
      
      // Handle resize
      const handleResize = () => {
        activityChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        activityChart.dispose();
      };
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        My Activity Overview
      </h3>
      <div className="h-80" ref={chartRef}></div>
    </div>
  );
};

export default UserActivityChart;