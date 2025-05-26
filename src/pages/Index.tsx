
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MoodSelector from '@/components/MoodSelector';
import VenueCard from '@/components/VenueCard';
import { venues as allVenues, Venue, Vibe } from '@/data/venues';
import Footer from '@/components/layout/Footer';
import { Info } from 'lucide-react';
import VenueMap from '@/components/VenueMap';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"; // Added carousel imports

// IMPORTANT: Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API key.
// For production, consider more secure ways to handle API keys.
const GOOGLE_MAPS_API_KEY = "AIzaSyD-TDEZAjo3rzWroKTxf-StVJbo64DjvPk"; 

// Default center for St. Augustine, FL
const ST_AUGUSTINE_COORDS = { lat: 29.894695, lng: -81.314493 };

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
  };

  const filteredVenues = useMemo(() => {
    if (!selectedMood) {
      return allVenues.slice(0, 3); 
    }
    return allVenues.filter(venue => venue.vibeTags.includes(selectedMood));
  }, [selectedMood]);

  const venuesForMap = useMemo(() => {
    // If a mood is selected, show only filtered venues on the map.
    // If no mood is selected, show the initial "Tonight's Highlights" venues.
    return filteredVenues;
  }, [filteredVenues]);

  return (
    <div className="min-h-screen bg-brand-deep-black text-foreground p-4 md:p-8 selection:bg-neon-pink selection:text-white">
      <div className="container mx-auto">
        <Header />
        <MoodSelector selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        
        {filteredVenues.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-3xl font-semibold mb-8 text-center neon-text-pink animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              {selectedMood ? `Vibes for: ${selectedMood}` : "Tonight's Highlights"}
            </h3>

            {!selectedMood ? (
              // CAROUSEL for "Tonight's Highlights"
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                // w-full max-w-md ensures the carousel itself is centered and sized appropriately
                // mx-auto centers it. max-w-md (448px) is slightly larger than VenueCard's max-w-sm (384px)
                // to accommodate buttons if they are positioned slightly outside the content area by default.
                className="w-full max-w-md mx-auto animate-fade-in-up"
                style={{ animationDelay: '1s' }} // Animation for the carousel container itself
              >
                <CarouselContent>
                  {filteredVenues.map((venue, index) => (
                    // flex justify-center ensures the VenueCard (which has max-w-sm) is centered within the CarouselItem
                    <CarouselItem key={venue.id} className="flex justify-center">
                      <VenueCard venue={venue} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious 
                  // Default shadcn styling positions these well.
                  // Adding specific colors to match the theme.
                  className="text-neon-pink border-neon-pink hover:bg-neon-pink/20 disabled:opacity-50" 
                />
                <CarouselNext 
                  className="text-neon-pink border-neon-pink hover:bg-neon-pink/20 disabled:opacity-50"
                />
              </Carousel>
            ) : (
              // GRID for selected mood
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredVenues.map((venue, index) => (
                  <VenueCard key={venue.id} venue={venue} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedMood && filteredVenues.length === 0 && (
           <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <Info className="mx-auto h-8 w-8 md:h-12 md:w-12 neon-text-teal mb-4" />
            <p className="text-2xl neon-text-teal">No venues match the "{selectedMood}" vibe right now.</p>
            <p className="text-lg text-gray-400 mt-2">Try another vibe or check back later!</p>
          </div>
        )}

        {/* Add the map component here */}
        <div className="mt-12">
           <h3 className="text-3xl font-semibold mb-8 text-center neon-text-teal animate-fade-in-up" style={{animationDelay: '1s'}}>
              Find them on the Map
            </h3>
          <VenueMap 
            venues={venuesForMap} 
            apiKey={GOOGLE_MAPS_API_KEY}
            defaultCenter={ST_AUGUSTINE_COORDS}
            defaultZoom={14} 
          />
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Index;

