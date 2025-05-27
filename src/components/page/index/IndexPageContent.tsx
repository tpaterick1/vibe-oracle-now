
import React from 'react';
// Removed PromptCarousel import
// Removed Vibe import
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useIndexPageData } from '@/hooks/useIndexPageData';
import AuthDisplay from '@/components/page/index/AuthDisplay';
import VenueGrid from '@/components/page/index/VenueGrid';
import MapDisplay from '@/components/page/index/MapDisplay';
import { GOOGLE_MAPS_API_KEY, ST_AUGUSTINE_COORDS } from '@/config/mapConstants';

const IndexPageContent: React.FC = () => {
  // Removed selectedMood state and handleSelectMood function
  const { user, logout, isLoading: authLoading } = useAuth();

  const { 
    allVenuesQuery, 
    externalEventsQuery, 
    filteredVenues, 
    venuesForMap 
  } = useIndexPageData(null); // Pass null as selectedMood is now handled internally by NightPlanGenerator or not at all here

  return (
    <>
      <AuthDisplay user={user} authLoading={authLoading} logout={logout} />
      <NightPlanGenerator /> 
      {/* PromptCarousel removed from here */}
      <VenueGrid 
        allVenuesQuery={allVenuesQuery}
        filteredVenues={filteredVenues}
        selectedMood={null} // Pass null or remove if VenueGrid filtering changes
      />
      <MapDisplay
        allVenuesQuery={allVenuesQuery}
        externalEventsQuery={externalEventsQuery}
        venuesForMap={venuesForMap}
        apiKey={GOOGLE_MAPS_API_KEY}
        defaultCenter={ST_AUGUSTINE_COORDS}
        defaultZoom={13}
      />
    </>
  );
};

export default IndexPageContent;
