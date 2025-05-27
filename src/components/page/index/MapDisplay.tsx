
import React from 'react';
import VenueMap from '@/components/VenueMap';
import { Venue } from '@/data/venues';
import { Info, Loader2 } from 'lucide-react';
import { UseQueryResult } from '@tanstack/react-query';
import { ExternalEvent } from '@/hooks/useIndexPageData'; // Import ExternalEvent type

interface MapDisplayProps {
  allVenuesQuery: UseQueryResult<Venue[], Error>;
  externalEventsQuery: UseQueryResult<ExternalEvent[], Error>;
  venuesForMap: Venue[];
  apiKey: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  allVenuesQuery,
  externalEventsQuery,
  venuesForMap,
  apiKey,
  defaultCenter,
  defaultZoom,
}) => {
  return (
    <div className="my-12 md:my-16"> {/* Removed w-full, outer container for vertical margins */}
      <div className="max-w-4xl mx-auto"> {/* Inner container for max-width and centering */}
        <h3 className="text-3xl font-semibold mb-6 text-center neon-text-purple animate-fade-in-up" style={{animationDelay: '0.4s'}}> {/* Changed to neon-text-purple */}
          Find Your Vibe on the Map
        </h3>
        {(allVenuesQuery.isLoading || externalEventsQuery.isLoading) ? (
          <div className="flex justify-center items-center h-64 bg-brand-charcoal rounded-lg">
            <Loader2 className="h-12 w-12 neon-text-purple animate-spin" /> {/* Changed to neon-text-purple */}
            <p className="ml-4 text-lg neon-text-purple">Loading map data...</p> {/* Changed to neon-text-purple */}
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
            apiKey={apiKey}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
          />
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
