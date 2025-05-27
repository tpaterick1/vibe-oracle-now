
import React from 'react';
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useIndexPageData } from '@/hooks/useIndexPageData';
import AuthDisplay from '@/components/page/index/AuthDisplay';
import VenueGrid from '@/components/page/index/VenueGrid';
import MapDisplay from '@/components/page/index/MapDisplay';
import { GOOGLE_MAPS_API_KEY, ST_AUGUSTINE_COORDS } from '@/config/mapConstants';

const IndexPageContent: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();

  const { 
    allVenuesQuery, 
    externalEventsQuery,
    filteredVenues,
    upcomingEvents,
    venuesForMap 
  } = useIndexPageData(null);

  return (
    <>
      <AuthDisplay user={user} authLoading={authLoading} logout={logout} />
      <NightPlanGenerator /> 
      {/* MapDisplay is now rendered after NightPlanGenerator and before VenueGrid */}
      <MapDisplay
        allVenuesQuery={allVenuesQuery}
        externalEventsQuery={externalEventsQuery}
        venuesForMap={venuesForMap}
        apiKey={GOOGLE_MAPS_API_KEY}
        defaultCenter={ST_AUGUSTINE_COORDS}
        defaultZoom={13}
      />
      <VenueGrid 
        allVenuesQuery={allVenuesQuery}
        externalEventsQuery={externalEventsQuery}
        filteredVenues={filteredVenues}
        upcomingEvents={upcomingEvents}
        selectedMood={null}
      />
    </>
  );
};

export default IndexPageContent;
