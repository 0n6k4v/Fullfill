import React from 'react';
import DonationCard from './DonationCard';
import EmptyDonationState from './EmptyDonationState';

const DonationList = ({ 
  donations,
  activeTab,
  onEdit,
  onDelete,
  onMarkAsComplete,
  onAddNew
}) => {
  console.log(`DonationList rendering for tab: ${activeTab}, items: ${donations.length}`);
  
  if (donations.length === 0) {
    return <EmptyDonationState activeTab={activeTab} onAddNew={onAddNew} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {donations.map(donation => (
        <DonationCard
          key={donation.id}
          donation={donation}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkAsComplete={onMarkAsComplete}
        />
      ))}
    </div>
  );
};

export default DonationList;