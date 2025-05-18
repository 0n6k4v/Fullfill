import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCharts = ({ chartData, showOnlyTrends = false }) => {
  useEffect(() => {
    // Cleanup
    return () => { };
  }, []);

  if (!chartData) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(showOnlyTrends ? 1 : 2)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    );
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  const trendsChartData = {
    labels: chartData.requestTrends?.map(d => new Date(d.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Requests',
        data: chartData.requestTrends?.map(d => d.count) || [],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      },
      {
        label: 'Donations',
        data: chartData.donationTrends?.map(d => d.count) || [],
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1
      },
    ],
  };

  // ถ้าต้องการแสดงเฉพาะกราฟแนวโน้ม ให้แสดงเฉพาะ Line chart
  if (showOnlyTrends) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Line options={trendOptions} data={trendsChartData} />
      </div>
    );
  }

  // ถ้าไม่ได้ระบุ showOnlyTrends จะแสดงกราฟทั้งหมด
  const categoryChartData = {
    labels: chartData.categoryDistribution?.map(c => c.category) || [],
    datasets: [
      {
        label: 'Requests',
        data: chartData.categoryDistribution?.map(c => c.requests) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue-500
      },
      {
        label: 'Donations',
        data: chartData.categoryDistribution?.map(c => c.donations) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // green-500
      },
    ],
  };
  
  const categoryOptions = {
    indexAxis: 'y', // For horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Request & Donation Trends</h3>
        <div className="h-80">
          <Line options={trendOptions} data={trendsChartData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution by Category</h3>
        <div className="h-80">
          <Bar options={categoryOptions} data={categoryChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;