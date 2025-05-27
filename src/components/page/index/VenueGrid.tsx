
import React from 'react';
import VenueCard from '@/components/VenueCard';
import { Venue, Vibe } from '@/data/venues';
import { Info, Circle, Loader2, CalendarDays } from 'lucide-react'; // Added CalendarDays
import { UseQueryResult } from '@tanstack/react-query';
import { ExternalEvent } from '@/hooks/useIndexPageData'; // Keep if needed, or rely on Venue type for upcomingEvents

interface VenueGridProps {
  allVenuesQuery: UseQueryResult<Venue[], Error>;
  externalEventsQuery: UseQueryResult<ExternalEvent[], Error>; // For loading/error state of events
  filteredVenues: Venue[];
  upcomingEvents: Venue[]; // Add this prop
  selectedMood: Vibe | null;
}

const VenueGrid: React.FC<VenueGridProps> = ({ 
  allVenuesQuery, 
  externalEventsQuery,
  filteredVenues, 
  upcomingEvents,
  selectedMood 
}) => {
  const venueLoading = allVenuesQuery.isLoading;
  const venueError = allVenuesQuery.isError;
  const eventsLoading = externalEventsQuery.isLoading;
  const eventsError = externalEventsQuery.isError;

  if (venueLoading && filteredVenues.length === 0) { // Show main loader if venues are still loading
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-12 w-12 neon-text-pink animate-spin" />
        <p className="text-2xl neon-text-pink mt-4">Loading venues & events...</p>
      </div>
    );
  }

  if (venueError && filteredVenues.length === 0 && upcomingEvents.length === 0) { // Show main error if both fail and nothing to show
    return (
      <div className="text-center py-12">
        <Info className="mx-auto h-12 w-12 neon-text-red mb-4" />
        <p className="text-2xl neon-text-red">Could not load content.</p>
        {allVenuesQuery.error && <p className="text-lg text-muted-foreground mt-2">Venues: {allVenuesQuery.error?.message}</p>}
        {externalEventsQuery.error && <p className="text-lg text-muted-foreground mt-2">Events: {externalEventsQuery.error?.message}</p>}
      </div>
    );
  }

  const showVenues = allVenuesQuery.isSuccess && filteredVenues.length > 0;
  const showNoVenuesMessage = allVenuesQuery.isSuccess && selectedMood && filteredVenues.length === 0;
  const showEvents = externalEventsQuery.isSuccess && upcomingEvents.length > 0;

  return (
    <div className="mt-12 mb-8 space-y-12">
      {/* Venues Section */}
      {venueLoading && filteredVenues.length === 0 && <div className="text-center py-6"><Loader2 className="mx-auto h-8 w-8 neon-text-pink animate-spin" /><p className="neon-text-pink mt-2">Loading highlights...</p></div>}
      {venueError && !showVenues && <div className="text-center py-6"><Info className="mx-auto h-8 w-8 neon-text-red" /><p className="neon-text-red mt-2">Could not load highlights. {allVenuesQuery.error?.message}</p></div>}
      
      {showVenues && (
        <div>
          <h3 
            className="text-3xl font-semibold mb-8 text-center neon-text-pink animate-fade-in-up flex items-center justify-center" 
            style={{animationDelay: '0.8s'}}
          >
            {selectedMood ? `Vibes for: ${selectedMood}` : (
              <>
                <span>Tonight's Highlights</span>
                <Circle className="ml-3 h-5 w-5 animate-pulse text-neon-pink" /> 
              </>
            )}
          </h3>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up"
            style={{ animationDelay: selectedMood ? '0s' : '1s' }} // Adjust animation for mood selection
          >
            {filteredVenues.map((venue, index) => (
              <VenueCard key={venue.id} venue={venue} index={index} />
            ))}
          </div>
        </div>
      )}

      {showNoVenuesMessage && (
         <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
          <Info className="mx-auto h-8 w-8 md:h-12 md:w-12 neon-text-teal mb-4" />
          <p className="text-2xl neon-text-teal">No venues match the "{selectedMood}" vibe right now.</p>
          <p className="text-lg text-muted-foreground mt-2">Try another vibe or check back later!</p>
        </div>
      )}

      {/* Upcoming Events Section */}
      {eventsLoading && upcomingEvents.length === 0 && <div className="text-center py-6"><Loader2 className="mx-auto h-8 w-8 neon-text-yellow animate-spin" /><p className="neon-text-yellow mt-2">Loading upcoming events...</p></div>}
      {eventsError && !showEvents && <div className="text-center py-6"><Info className="mx-auto h-8 w-8 neon-text-red" /><p className="neon-text-red mt-2">Could not load upcoming events. {externalEventsQuery.error?.message}</p></div>}

      {showEvents && (
        <div>
          <h3 
            className="text-3xl font-semibold mb-8 text-center neon-text-yellow animate-fade-in-up flex items-center justify-center" 
            style={{animationDelay: '1.2s'}}
          >
            <CalendarDays className="mr-3 h-7 w-7" />
            <span>Upcoming Local Events</span>
          </h3>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up"
            style={{ animationDelay: '1.4s' }}
          >
            {upcomingEvents.map((event, index) => (
              <VenueCard key={event.id} venue={event} index={index} /> // VenueCard handles 'event-' prefixed IDs
            ))}
          </div>
        </div>
      )}
       {(allVenuesQuery.isSuccess && filteredVenues.length === 0 && !selectedMood && externalEventsQuery.isSuccess && upcomingEvents.length === 0) && (
         <div className="text-center py-12 animate-fade-in-up">
          <Info className="mx-auto h-12 w-12 neon-text-teal mb-4" />
          <p className="text-2xl neon-text-teal">Nothing to show right now.</p>
          <p className="text-lg text-muted-foreground mt-2">Check back later for new venues and events!</p>
        </div>
      )}
    </div>
  );
};

export default VenueGrid;

