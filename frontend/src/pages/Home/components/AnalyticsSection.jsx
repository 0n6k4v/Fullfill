'use client';

import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

const AnalyticsSection = ({ 
  donationsByMonth = { months: [], donations: [], received: [] }, 
  categoryDistribution = { categories: [], values: [] } 
}) => {
  // Ensure data is valid
  const safeDonationsByMonth = {
    months: Array.isArray(donationsByMonth?.months) ? donationsByMonth.months : [],
    donations: Array.isArray(donationsByMonth?.donations) ? donationsByMonth.donations : [],
    received: Array.isArray(donationsByMonth?.received) ? donationsByMonth.received : []
  };

  const safeCategoryDistribution = {
    categories: Array.isArray(categoryDistribution?.categories) ? categoryDistribution.categories : [],
    values: Array.isArray(categoryDistribution?.values) ? categoryDistribution.values : []
  };
  
  useEffect(() => {
    // Donations by month chart
    const donationsChartDom = document.getElementById('donations-chart');
    if (donationsChartDom) {
      const donationsChart = echarts.init(donationsChartDom);
      const donationsOption = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['บริจาค', 'ได้รับ'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: safeDonationsByMonth.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'บริจาค',
            type: 'bar',
            data: safeDonationsByMonth.donations,
            itemStyle: {
              color: '#3B82F6'
            }
          },
          {
            name: 'ได้รับ',
            type: 'bar',
            data: safeDonationsByMonth.received,
            itemStyle: {
              color: '#10B981'
            }
          }
        ]
      };
      donationsChart.setOption(donationsOption);
      
      // Handle resize
      const handleResize = () => {
        donationsChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [safeDonationsByMonth]);
  
  useEffect(() => {
    // Category distribution chart
    const categoryChartDom = document.getElementById('category-chart');
    if (categoryChartDom) {
      const categoryChart = echarts.init(categoryChartDom);
      const categoryOption = {
        animation: false,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: safeCategoryDistribution.categories
        },
        series: [
          {
            name: 'หมวดหมู่',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: safeCategoryDistribution.categories.map((category, index) => ({
              value: safeCategoryDistribution.values[index] || 0,
              name: category
            }))
          }
        ]
      };
      categoryChart.setOption(categoryOption);
      
      // Handle resize
      const handleResize = () => {
        categoryChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [safeCategoryDistribution]);

  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">การวิเคราะห์การบริจาค</h3>
            <p className="mt-1 text-sm text-gray-500">ติดตามกิจกรรมและผลกระทบจากการบริจาคของคุณ</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />6 เดือนล่าสุด
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />ส่งออก
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">กิจกรรมการบริจาค</h4>
            <div className="h-80" id="donations-chart"></div>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">การกระจายตามหมวดหมู่</h4>
            <div className="h-80" id="category-chart"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;