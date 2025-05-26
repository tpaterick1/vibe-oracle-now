import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MoodSelector from '@/components/MoodSelector';
import VenueCard from '@/components/VenueCard';
import { venues as allVenues, Venue, Vibe } from '@/data/venues';
import Footer from '@/components/layout/Footer';
import { Info } from 'lucide-react';
import VenueMap from '@/components/VenueMap';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import NightPlanGenerator from '@/components/NightPlanGenerator';

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
                className="w-full max-w-lg mx-auto animate-fade-in-up"
                style={{ animationDelay: '1s' }}
              >
                <CarouselContent>
                  {filteredVenues.map((venue, index) => (
                    <CarouselItem key={venue.id} className="flex justify-center">
                      <VenueCard venue={venue} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious 
                  className="text-neon-pink border-neon-pink hover:bg-neon-pink/20 disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-110" 
                />
                <CarouselNext 
                  className="text-neon-pink border-neon-pink hover:bg-neon-pink/20 disabled:opacity-50 transition-transform duration-200 ease-in-out hover:scale-110"
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

        <NightPlanGenerator />

      </div>
      <Footer />
    </div>
  );
};

export default Index;
