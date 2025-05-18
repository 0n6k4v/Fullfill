import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryFulfillmentChart = ({ categoryData }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  const sortedData = [...categoryData].sort((a, b) => b.shortage - a.shortage);
  const limitedData = sortedData.slice(0, 7); // แสดง 7 อันดับแรก

  const chartData = {
    labels: limitedData.map(item => item.categoryName),
    datasets: [
      {
        label: 'จำนวนที่ถูกร้องขอ (Requests)',
        data: limitedData.map(item => item.totalRequestsInCategory),
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        stack: 'Stack 0', // จัดกลุ่มแท่ง
      },
      {
        label: 'จำนวนที่ได้รับการบริจาคแล้ว (Donated/Available)',
        data: limitedData.map(item => item.availableDonationsInCategory),
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        stack: 'Stack 1', // จัดกลุ่มแท่ง
      },
      // Optional: แสดงแท่งความขาดแคลนโดยตรง (ถ้าต้องการ)
      // {
      //   label: 'ความขาดแคลน (Shortage)',
      //   data: limitedData.map(item => item.shortage > 0 ? item.shortage : 0), // แสดงเฉพาะค่าบวก
      //   backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
      //   borderColor: 'rgb(239, 68, 68)',
      //   borderWidth: 1,
      //   stack: 'Stack 0', // ถ้าต้องการให้ซ้อนกับ Requests
      // },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ภาพรวมความต้องการและการตอบสนองตามประเภท (Top 7)',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const item = limitedData[dataIndex];
            const shortage = item.shortage;
            const fulfillmentRate = item.fulfillmentRate.toFixed(1);
            
            let tooltipText = [`อัตราตอบสนอง: ${fulfillmentRate}%`];
            if (shortage > 0) {
              tooltipText.push(`ยังขาดอีก: ${shortage} ชิ้น`);
            } else if (shortage < 0) {
              tooltipText.push(`มีเกินความต้องการ: ${Math.abs(shortage)} ชิ้น`);
            } else {
              tooltipText.push(`ตรงตามความต้องการ`);
            }
            return tooltipText;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'ประเภทสิ่งของ'
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'จำนวนรายการ'
        },
        // ถ้าใช้ stacked bar chart อาจจะต้องปรับ scale
        // stacked: true, 
      },
    },
    // ถ้าต้องการให้เป็น grouped bar chart (แท่ง Request และ Donate อยู่ข้างกัน)
    // โดยไม่ต้องใช้ stack property ใน datasets
    // interaction: {
    //   mode: 'index',
    //   intersect: false,
    // },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategoryFulfillmentChart;