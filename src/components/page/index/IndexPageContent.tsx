
import React, { useState } from 'react';
import PromptCarousel from '@/components/PromptCarousel';
import { Vibe } from '@/data/venues';
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useIndexPageData } from '@/hooks/useIndexPageData';
import AuthDisplay from '@/components/page/index/AuthDisplay';
import VenueGrid from '@/components/page/index/VenueGrid';
import MapDisplay from '@/components/page/index/MapDisplay';
import { GOOGLE_MAPS_API_KEY, ST_AUGUSTINE_COORDS } from '@/config/mapConstants';

const IndexPageContent: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const { user, logout, isLoading: authLoading } = useAuth();

  const { 
    allVenuesQuery, 
    externalEventsQuery, 
    filteredVenues, 
    venuesForMap 
  } = useIndexPageData(selectedMood);

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
  };

  return (
    <>
      <AuthDisplay user={user} authLoading={authLoading} logout={logout} />
      <NightPlanGenerator />
      <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
      <VenueGrid 
        allVenuesQuery={allVenuesQuery}
        filteredVenues={filteredVenues}
        selectedMood={selectedMood}
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
