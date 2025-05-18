import React from 'react';
import DonationCard from './DonationCard';
import EmptyDonationState from './EmptyDonationState';

const DonationList = ({ 
  donations = [],
  activeTab = 'all',
  onEdit,
  onDelete,
  onMarkAsComplete,
  onAddNew
}) => {
  // Ensure donations is an array
  const safeDonations = Array.isArray(donations) ? donations : [];
  
  console.log(`DonationList rendering for tab: ${activeTab}, items: ${safeDonations.length}`);
  
  if (safeDonations.length === 0) {
    return <EmptyDonationState activeTab={activeTab} onAddNew={onAddNew} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeDonations.map(donation => {
        if (!donation || !donation.id) return null;
        return (
          <DonationCard
            key={donation.id}
            donation={donation}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkAsComplete={onMarkAsComplete}
          />
        );
      })}
    </div>
  );
};

export default DonationList;