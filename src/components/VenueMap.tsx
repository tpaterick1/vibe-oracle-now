
import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Venue } from '@/data/venues';
import { MapPin } from 'lucide-react';

interface VenueMapProps {
  venues: Venue[];
  apiKey: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

const VenueMap: React.FC<VenueMapProps> = ({ venues, apiKey, defaultCenter, defaultZoom }) => {
  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="p-4 my-8 text-center bg-brand-charcoal rounded-lg shadow-lg">
        <p className="text-neon-pink">Google Maps API Key is missing or is a placeholder.</p>
        <p className="text-muted-foreground">Please provide a valid API key in `src/pages/Index.tsx` to display the map.</p>
      </div>
    );
  }

  return (
    <div className="my-8 h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl glassmorphism-card border-neon-teal">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId="staugustine_tonight_map" // Optional: for custom styling in Google Cloud Console
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="w-full h-full"
        >
          {venues.map((venue) => (
            <AdvancedMarker
              key={venue.id}
              position={{ lat: venue.lat, lng: venue.lng }}
              title={venue.name}
            >
              {/* You can customize the marker icon here */}
              <div className="transform -translate-x-1/2 -translate-y-full">
                <MapPin className="h-8 w-8 text-neon-pink" fill="#FF00AA" strokeWidth={1.5} /> 
                <span className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-brand-deep-black rounded whitespace-nowrap shadow-md">
                  {venue.name}
                </span>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default VenueMap;

