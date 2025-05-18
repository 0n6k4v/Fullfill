import React from 'react';
import MatchCard from './MatchCard';

const MatchesSection = ({ matches = [] }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">การจับคู่</h2>
        <p className="text-gray-500">No matches available</p>
      </div>
    );
  }

  const incomingMatches = matches.filter(match => match.type === 'incoming') || [];
  const outgoingMatches = matches.filter(match => match.type === 'outgoing') || [];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">การจับคู่</h2>
      
      {incomingMatches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">คำขอที่ได้รับ</h3>
          <div className="space-y-4">
            {incomingMatches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        </div>
      )}
      
      {outgoingMatches.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">คำขอที่ส่ง</h3>
          <div className="space-y-4">
            {outgoingMatches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesSection;