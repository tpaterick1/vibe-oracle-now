
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
          apiKey={apiKey}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />
      )}
    </div>
  );
};

export default MapDisplay;
