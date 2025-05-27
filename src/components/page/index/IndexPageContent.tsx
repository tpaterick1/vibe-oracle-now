
import React, { useState } from 'react'; // Added useState
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useIndexPageData } from '@/hooks/useIndexPageData';
import AuthDisplay from '@/components/page/index/AuthDisplay';
import VenueGrid from '@/components/page/index/VenueGrid';
import MapDisplay from '@/components/page/index/MapDisplay';
import { GOOGLE_MAPS_API_KEY, ST_AUGUSTINE_COORDS } from '@/config/mapConstants';
import { Vibe } from '@/data/venues'; // Added Vibe import

const IndexPageContent: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null); // Added selectedMood state

  const { 
    allVenuesQuery, 
    externalEventsQuery,
    filteredVenues,
    upcomingEvents,
    venuesForMap 
  } = useIndexPageData(selectedMood); // Pass dynamic selectedMood

  return (
    <>
      <AuthDisplay user={user} authLoading={authLoading} logout={logout} />
      <NightPlanGenerator 
        selectedMood={selectedMood} 
        setSelectedMood={setSelectedMood} 
      /> 
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
        selectedMood={selectedMood} // Pass dynamic selectedMood
      />
    </>
  );
};

export default IndexPageContent;

