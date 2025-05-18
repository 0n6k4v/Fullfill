import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import api from '@/services/api';

const UserActivityChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api.get('/users/me/activity/chart');
        setChartData(response.data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        // Use fallback data if API fails
        setChartData({
          categories: ["Jan", "Feb", "Mar", "Apr", "May"],
          donations: [0, 0, 0, 0, 0],
          requests: [0, 0, 0, 0, 0]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    // User Activity Chart
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
        data: chartData.categories || [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Donations",
          type: "line",
          data: chartData.donations || [],
          itemStyle: { color: "#10B981" },
        },
        {
          name: "Requests",
          type: "line",
          data: chartData.requests || [],
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
  }, [chartData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        My Activity Overview
      </h3>
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="h-80" ref={chartRef}></div>
      )}
    </div>
  );
};

export default UserActivityChart;