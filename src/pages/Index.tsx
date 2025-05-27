
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import PromptCarousel from '@/components/PromptCarousel';
import { Vibe } from '@/data/venues'; // Venue type removed as it's handled in the hook/components
import Footer from '@/components/layout/Footer';
// Removed icon imports that are now in sub-components
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
// Removed Link and Button as AuthDisplay handles them
// Removed useQuery as it's in useIndexPageData
// Removed supabase client as it's in useIndexPageData
// Removed VenueMap import as it's in MapDisplay

import { useIndexPageData } from '@/hooks/useIndexPageData';
import AuthDisplay from '@/components/page/index/AuthDisplay';
import VenueGrid from '@/components/page/index/VenueGrid';
import MapDisplay from '@/components/page/index/MapDisplay';

// IMPORTANT: Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API key.
// For production, consider more secure ways to handle API keys.
const GOOGLE_MAPS_API_KEY = "AIzaSyD-TDEZAjo3rzWroKTxf-StVJbo64DjvPk"; 

// Default center for St. Augustine, FL
const ST_AUGUSTINE_COORDS = { lat: 29.894695, lng: -81.314493 };

// ExternalEvent interface, fetchVenues, fetchExternalEvents are moved to useIndexPageData.ts

const Index = () => {
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

  // filteredVenues and venuesForMap logic is now in useIndexPageData

  return (
    <div className="min-h-screen bg-brand-deep-black text-foreground p-4 md:p-8 selection:bg-neon-pink selection:text-white">
      <div className="container mx-auto">
        <Header />

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
      </div>
      <Footer />
    </div>
  );
};

export default Index;
