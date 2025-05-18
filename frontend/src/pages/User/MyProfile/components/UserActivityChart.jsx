import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import api from '@/services/api';

const UserActivityChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    categories: [],
    donations: [],
    requests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/users/me/activity/chart');
        if (response?.data) {
          setChartData({
            categories: response.data.categories || [],
            donations: response.data.donations || [],
            requests: response.data.requests || []
          });
        } else {
          throw new Error('ไม่พบข้อมูลกราฟ');
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลกราฟได้');
        // Use fallback data if API fails
        setChartData({
          categories: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."],
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

    let activityChart = null;
    try {
      // User Activity Chart
      activityChart = echarts.init(chartRef.current);
      const activityOption = {
        animation: false,
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            if (!Array.isArray(params)) return '';
            return params.map(param => {
              const value = param.value || 0;
              const seriesName = param.seriesName || '';
              return `${seriesName}: ${value}`;
            }).join('<br/>');
          }
        },
        legend: {
          data: ["การบริจาค", "คำขอรับบริจาค"],
          textStyle: {
            fontFamily: 'Kanit, sans-serif'
          }
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
          axisLabel: {
            fontFamily: 'Kanit, sans-serif'
          }
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            fontFamily: 'Kanit, sans-serif'
          }
        },
        series: [
          {
            name: "การบริจาค",
            type: "line",
            data: chartData.donations || [],
            itemStyle: { color: "#10B981" },
            smooth: true,
            symbol: 'circle',
            symbolSize: 8
          },
          {
            name: "คำขอรับบริจาค",
            type: "line",
            data: chartData.requests || [],
            itemStyle: { color: "#3B82F6" },
            smooth: true,
            symbol: 'circle',
            symbolSize: 8
          },
        ],
      };
      activityChart.setOption(activityOption);
    } catch (err) {
      console.error("Error initializing chart:", err);
      setError('ไม่สามารถแสดงกราฟได้');
    }
    
    // Handle resize
    const handleResize = () => {
      if (activityChart) {
        activityChart.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (activityChart) {
        activityChart.dispose();
      }
    };
  }, [chartData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        ภาพรวมกิจกรรมของฉัน
      </h3>
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      ) : error ? (
        <div className="h-80 flex items-center justify-center text-red-500">
          <span className="text-center">{error}</span>
        </div>
      ) : (
        <div className="h-80" ref={chartRef}></div>
      )}
    </div>
  );
};

export default UserActivityChart;