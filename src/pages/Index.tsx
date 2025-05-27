import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import PromptCarousel from '@/components/PromptCarousel';
import VenueCard from '@/components/VenueCard';
import { Vibe, moods, Venue } from '@/data/venues'; // Venue type, moods array, Vibe type
import Footer from '@/components/layout/Footer';
import { Info, LogIn, LogOut, Circle, Loader2 } from 'lucide-react';
// Removed Carousel imports as they are no longer used for "Tonight's Highlights"
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VenueMap from '@/components/VenueMap'; // Added import for VenueMap

// IMPORTANT: Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API key.
// For production, consider more secure ways to handle API keys.
const GOOGLE_MAPS_API_KEY = "AIzaSyD-TDEZAjo3rzWroKTxf-StVJbo64DjvPk"; 

// Default center for St. Augustine, FL
const ST_AUGUSTINE_COORDS = { lat: 29.894695, lng: -81.314493 };

// Interface for External Events based on the Supabase table
interface ExternalEvent {
  id: string;
  event_title: string;
  event_description: string | null;
  event_type: string;
  start_datetime: string;
  end_datetime: string | null;
  venue_name: string | null;
  venue_address: string | null;
  lat: number | null;
  lng: number | null;
  source_url: string | null;
  image_url: string | null;
}

const fetchVenues = async (): Promise<Venue[]> => {
  // Using select aliasing to map snake_case columns to camelCase properties
  const { data, error } = await supabase
    .from('venues')
    .select(`
      id,
      name,
      vibeTags:vibe_tags,
      story,
      image,
      neonColorClass:neon_color_class,
      textColorClass:text_color_class,
      lat,
      lng,
      created_at,
      updated_at
    `);

  if (error) {
    console.error('Error fetching venues:', error);
    throw new Error(error.message);
  }
  // Ensure vibeTags is always an array and cast its elements to Vibe
  return data?.map(venue => ({ 
    ...venue, 
    vibeTags: (venue.vibeTags || []).map(tag => tag as Vibe) // Explicitly cast each tag
  })) || [];
};

const fetchExternalEvents = async (): Promise<ExternalEvent[]> => {
  const { data, error } = await supabase
    .from('external_events')
    .select(`
      id,
      event_title,
      event_description,
      event_type,
      start_datetime,
      end_datetime,
      venue_name,
      venue_address,
      lat,
      lng,
      source_url,
      image_url
    `)
    // Fetch events starting from today or in the future, limit to 50 for performance
    .gte('start_datetime', new Date().toISOString().split('T')[0] + 'T00:00:00.000Z') 
    .order('start_datetime', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Error fetching external events:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const { user, logout, isLoading: authLoading } = useAuth();

  const allVenuesQuery = useQuery<Venue[], Error>({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  });

  const externalEventsQuery = useQuery<ExternalEvent[], Error>({
    queryKey: ['external_events'],
    queryFn: fetchExternalEvents,
  });

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
  };

  const filteredVenues = useMemo(() => {
    if (!allVenuesQuery.data) {
      return [];
    }
    if (!selectedMood) {
      // Show up to 9 highlights if no mood is selected for the 3-column grid
      return allVenuesQuery.data.slice(0, 9); 
    }
    return allVenuesQuery.data.filter(venue => venue.vibeTags.includes(selectedMood));
  }, [selectedMood, allVenuesQuery.data]);

  const venuesForMap = useMemo(() => {
    const baseVenues: Venue[] = [];
    if (allVenuesQuery.data) {
      // Use filteredVenues if a mood is selected, otherwise show a default set of venues (e.g., first 5)
      // This logic remains consistent with previous behavior for venues.
      baseVenues.push(...(filteredVenues.length > 0 ? filteredVenues : allVenuesQuery.data.slice(0, 5)));
    }

    const mappedEvents: Venue[] = [];
    if (externalEventsQuery.data) {
      externalEventsQuery.data.forEach(ev => {
        if (ev.lat != null && ev.lng != null) { // Ensure lat/lng are present
          mappedEvents.push({
            id: `event-${ev.id}`, // Prefix ID to avoid collision with venue IDs
            name: ev.event_title,
            lat: ev.lat,
            lng: ev.lng,
            vibeTags: [], // Events don't have VibeTags in the same way venues do
            story: `Event Type: ${ev.event_type}. ${ev.event_description || ''}. Starts: ${new Date(ev.start_datetime).toLocaleString()}. ${ev.venue_name ? 'At: ' + ev.venue_name : ''}`,
            image: ev.image_url || '/placeholder.svg',
            // Using distinct colors for event markers, assuming VenueMap might use these
            neonColorClass: 'neon-border-yellow-500', 
            textColorClass: 'text-neon-yellow',
            // created_at and updated_at are not part of the core Venue structure for the map.
          });
        }
      });
    }
    // Combine venues and mapped events for the map
    return [...baseVenues, ...mappedEvents];
  }, [filteredVenues, allVenuesQuery.data, externalEventsQuery.data]);

  return (
    <div className="min-h-screen bg-brand-deep-black text-foreground p-4 md:p-8 selection:bg-neon-pink selection:text-white">
      <div className="container mx-auto">
        <Header />

        {/* Auth Status and Actions */}
        <div className="flex justify-end items-center my-4 sm:my-6 space-x-4"> {/* Adjusted margin */}
          {authLoading ? (
            <span className="text-muted-foreground">Loading user...</span>
          ) : user ? (
            <>
              <span className="text-neon-teal hidden sm:inline">Welcome, {user.email}!</span>
              <Button onClick={logout} variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="border-neon-teal text-neon-teal hover:bg-neon-teal/20 hover:text-white">
                <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
              </Button>
            </Link>
          )}
        </div>

        {/* NightPlanGenerator moved to the top */}
        <NightPlanGenerator />

        {/* PromptCarousel */}
        <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        
        {/* Filtered Venues Section */}
        {allVenuesQuery.isLoading && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 neon-text-pink animate-spin" />
            <p className="text-2xl neon-text-pink mt-4">Loading venues...</p>
          </div>
        )}
        {allVenuesQuery.isError && (
          <div className="text-center py-12">
            <Info className="mx-auto h-12 w-12 neon-text-red mb-4" />
            <p className="text-2xl neon-text-red">Could not load venues.</p>
            <p className="text-lg text-muted-foreground mt-2">{allVenuesQuery.error?.message}</p>
          </div>
        )}
        {allVenuesQuery.isSuccess && filteredVenues.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 
              className="text-3xl font-semibold mb-8 text-center neon-text-pink animate-fade-in-up flex items-center justify-center" 
              style={{animationDelay: '0.8s'}}
            >
              {selectedMood ? `Vibes for: ${selectedMood}` : (
                <>
                  <span>Tonight's Highlights</span>
                  <Circle className="ml-3 h-5 w-5 animate-spin text-neon-pink" />
                </>
              )}
            </h3>

            {!selectedMood ? (
              // GRID for "Tonight's Highlights"
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up"
                style={{ animationDelay: '1s' }}
              >
                {filteredVenues.map((venue, index) => (
                  <VenueCard key={venue.id} venue={venue} index={index} />
                ))}
              </div>
            ) : (
              // GRID for selected mood (existing logic)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredVenues.map((venue, index) => (
                  <VenueCard key={venue.id} venue={venue} index={index} />
                ))}
              </div>
            )}
          </div>
        )}
        {allVenuesQuery.isSuccess && selectedMood && filteredVenues.length === 0 && (
           <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <Info className="mx-auto h-8 w-8 md:h-12 md:w-12 neon-text-teal mb-4" />
            <p className="text-2xl neon-text-teal">No venues match the "{selectedMood}" vibe right now.</p>
            <p className="text-lg text-muted-foreground mt-2">Try another vibe or check back later!</p>
          </div>
        )}
        
        {/* Map Section */}
        <div className="my-12 md:my-16 w-full">
           <h3 className="text-3xl font-semibold mb-6 text-center neon-text-teal animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Find Your Vibe on the Map
            </h3>
          {(allVenuesQuery.isLoading || externalEventsQuery.isLoading) ? (
            <div className="flex justify-center items-center h-64 bg-brand-charcoal rounded-lg">
              <Loader2 className="h-12 w-12 neon-text-teal animate-spin" />
              <p className="ml-4 text-lg neon-text-teal">Loading map data...</p>
            </div>
          ) : (allVenuesQuery.isError || externalEventsQuery.isError) ? (
            <div className="text-center py-12 bg-brand-charcoal rounded-lg p-6">
              <Info className="mx-auto h-12 w-12 neon-text-red mb-4" />
              <p className="text-2xl neon-text-red">Error loading map data.</p>
              {allVenuesQuery.isError && <p className="text-muted-foreground mt-1">Venues: {allVenuesQuery.error?.message}</p>}
              {externalEventsQuery.isError && <p className="text-muted-foreground mt-1">Events: {externalEventsQuery.error?.message}</p>}
            </div>
          ) : (
            <VenueMap 
              venues={venuesForMap} 
              apiKey={GOOGLE_MAPS_API_KEY}
              defaultCenter={ST_AUGUSTINE_COORDS}
              defaultZoom={13}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
