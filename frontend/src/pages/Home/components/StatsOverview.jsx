import React from 'react';
import StatCard from './StatCard';

const StatsOverview = ({ stats = [] }) => {
  if (!stats || !Array.isArray(stats)) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="text-gray-500 text-center">ไม่พบข้อมูลสถิติ</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default StatsOverview;