import React from 'react';
import StatCard from './StatCard';

const StatsOverview = ({ stats = [] }) => {
  // Ensure stats is an array
  const safeStats = Array.isArray(stats) ? stats : [];

  if (safeStats.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="text-gray-500 text-center">ไม่พบข้อมูลสถิติ</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {safeStats.map((stat, index) => {
        if (!stat) return null;
        return <StatCard key={index} stat={stat} index={index} />;
      })}
    </div>
  );
};

export default StatsOverview;