import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const DashboardCharts = () => {
  useEffect(() => {
    // Category Analysis Chart
    const categoryChart = echarts.init(
      document.getElementById("categoryChart"),
    );
    const categoryOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["Requests", "Donations"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [
          "Clothing",
          "Food",
          "School",
          "Medical",
          "Furniture",
          "Electronics",
        ],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Requests",
          type: "bar",
          data: [320, 302, 301, 334, 390, 330],
          itemStyle: {
            color: "#3B82F6",
          },
        },
        {
          name: "Donations",
          type: "bar",
          data: [220, 182, 191, 234, 290, 330],
          itemStyle: {
            color: "#10B981",
          },
        },
      ],
    };
    categoryChart.setOption(categoryOption);
    
    // Fulfillment Rate Chart
    const fulfillmentChart = echarts.init(
      document.getElementById("fulfillmentChart"),
    );
    const fulfillmentOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Fulfillment Rate"],
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
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [
        {
          name: "Fulfillment Rate",
          type: "line",
          data: [65, 72, 68, 75, 82, 78, 85],
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(79, 70, 229, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(79, 70, 229, 0.01)",
                },
              ],
            },
          },
          lineStyle: {
            color: "#4F46E5",
          },
          itemStyle: {
            color: "#4F46E5",
          },
        },
      ],
    };
    fulfillmentChart.setOption(fulfillmentOption);
    
    // Cleanup
    return () => {
      categoryChart.dispose();
      fulfillmentChart.dispose();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Donation Categories Analysis
          </h3>
          <select className="text-sm border-gray-300 rounded-md">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-80" id="categoryChart"></div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Request Fulfillment Rate
          </h3>
          <select className="text-sm border-gray-300 rounded-md">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-80" id="fulfillmentChart"></div>
      </div>
    </div>
  );
};

export default DashboardCharts;