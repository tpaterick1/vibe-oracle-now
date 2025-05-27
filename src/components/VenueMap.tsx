import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Venue } from '@/data/venues';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { moodIcons, busynessEmojis } from '@/data/moodVisuals';

interface VenueMapProps {
  venues: Venue[];
  apiKey: string;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
}

const VenueMap: React.FC<VenueMapProps> = ({ venues, apiKey, defaultCenter, defaultZoom }) => {
  const { user } = useAuth();

  const handleMarkerClick = async (venue: Venue) => {
    if (venue.id.startsWith('event-') && user) {
      const eventId = venue.id.replace('event-', '');
      console.log(`Event marker clicked: ${venue.name}, Event ID: ${eventId}, User ID: ${user.id}`);
      try {
        const { error } = await supabase.from('event_clicks').insert([
          { user_id: user.id, event_id: eventId }
        ]);
        if (error) {
          if (error.code === '23505') { // PostgreSQL unique_violation code
            toast.info(`You've already shown interest in "${venue.name}".`);
          } else {
            toast.error(`Failed to save preference: ${error.message}`);
            console.error('Error logging event marker click:', error);
          }
        } else {
          toast.success(`Preference for "${venue.name}" saved!`);
        }
      } catch (err) {
        toast.error('An unexpected error occurred while saving preference.');
        console.error('Unexpected error logging event marker click:', err);
      }
    } else if (venue.id.startsWith('event-') && !user) {
      toast.info('Login to save your event preferences!');
      // navigate('/auth'); // Optional: redirect to login page
    } else {
        console.log(`Venue marker clicked: ${venue.name} (not an event or no user)`);
    }
  };

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="p-4 my-8 text-center bg-brand-charcoal rounded-lg shadow-lg">
        <p className="text-neon-pink">Google Maps API Key is missing or is a placeholder.</p>
        <p className="text-muted-foreground">Please provide a valid API key in `src/config/mapConstants.ts`. For production, consider using environment variables or Supabase secrets.</p>
        <p className="text-sm text-gray-400 mt-2">You can get a Google Maps API key from the <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer" className="underline hover:text-neon-teal">Google Cloud Console</a>.</p>
      </div>
    );
  }

  return (
    <div className="my-8 h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl glassmorphism-card border-neon-purple">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId="staugustine_tonight_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="w-full h-full"
        >
          {venues.map((venue) => {
            const VibeIcon = venue.vibeTags.length > 0 ? moodIcons[venue.vibeTags[0]] : null;
            const busynessEmoji = venue.busyness ? busynessEmojis[venue.busyness] : null;

            return (
              <AdvancedMarker
                key={venue.id}
                position={{ lat: venue.lat, lng: venue.lng }}
                title={venue.name}
                onClick={() => handleMarkerClick(venue)}
              >
                <div className={cn(
                  "relative flex flex-col items-center",
                  venue.id.startsWith('event-') ? 'cursor-pointer' : ''
                )}>
                  <MapPin className="h-8 w-8 text-neon-pink" fill="#FF00AA" strokeWidth={1.5} />
                  <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-brand-deep-black rounded whitespace-nowrap shadow-md flex items-center space-x-1">
                    {VibeIcon && <VibeIcon className="h-3 w-3" />}
                    <span>{venue.name}</span>
                    {busynessEmoji && <span className="text-sm">{busynessEmoji}</span>}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
};

export default VenueMap;
