import React from 'react';
import MatchCard from './MatchCard';

const MatchesSection = ({ matches }) => {
  const incomingMatches = matches.filter(match => match.type === 'incoming');
  const outgoingMatches = matches.filter(match => match.type === 'outgoing');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">My Matches</h3>
        <p className="mt-1 text-sm text-gray-500">View and manage your donation matches</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Incoming Offers</h4>
            {incomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Outgoing Requests</h4>
            {outgoingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesSection;