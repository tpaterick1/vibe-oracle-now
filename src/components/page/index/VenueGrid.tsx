
import React from 'react';
import VenueCard from '@/components/VenueCard';
import { Venue, Vibe } from '@/data/venues';
import { Info, Circle, Loader2 } from 'lucide-react';
import { UseQueryResult } from '@tanstack/react-query';

interface VenueGridProps {
  allVenuesQuery: UseQueryResult<Venue[], Error>;
  filteredVenues: Venue[];
  selectedMood: Vibe | null;
}

const VenueGrid: React.FC<VenueGridProps> = ({ allVenuesQuery, filteredVenues, selectedMood }) => {
  if (allVenuesQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-12 w-12 neon-text-pink animate-spin" />
        <p className="text-2xl neon-text-pink mt-4">Loading venues...</p>
      </div>
    );
  }

  if (allVenuesQuery.isError) {
    return (
      <div className="text-center py-12">
        <Info className="mx-auto h-12 w-12 neon-text-red mb-4" />
        <p className="text-2xl neon-text-red">Could not load venues.</p>
        <p className="text-lg text-muted-foreground mt-2">{allVenuesQuery.error?.message}</p>
      </div>
    );
  }

  if (allVenuesQuery.isSuccess && filteredVenues.length > 0) {
    return (
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
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            {filteredVenues.map((venue, index) => (
              <VenueCard key={venue.id} venue={venue} index={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredVenues.map((venue, index) => (
              <VenueCard key={venue.id} venue={venue} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (allVenuesQuery.isSuccess && selectedMood && filteredVenues.length === 0) {
    return (
       <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
        <Info className="mx-auto h-8 w-8 md:h-12 md:w-12 neon-text-teal mb-4" />
        <p className="text-2xl neon-text-teal">No venues match the "{selectedMood}" vibe right now.</p>
        <p className="text-lg text-muted-foreground mt-2">Try another vibe or check back later!</p>
      </div>
    );
  }

  return null; // Should not happen if logic is correct
};

export default VenueGrid;
