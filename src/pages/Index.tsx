import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MoodSelector from '@/components/MoodSelector';
import VenueCard from '@/components/VenueCard';
import { venues as allVenues, Venue, Vibe } from '@/data/venues';
import Footer from '@/components/layout/Footer';
import { Info, LogIn, LogOut, Video as VideoIcon } from 'lucide-react';
import VenueMap from '@/components/VenueMap';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import NightPlanGenerator from '@/components/NightPlanGenerator';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import WebcamLightbox from '@/components/WebcamLightbox';

// IMPORTANT: Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API key.
// For production, consider more secure ways to handle API keys.
const GOOGLE_MAPS_API_KEY = "AIzaSyD-TDEZAjo3rzWroKTxf-StVJbo64DjvPk"; 

// Default center for St. Augustine, FL
const ST_AUGUSTINE_COORDS = { lat: 29.894695, lng: -81.314493 };

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isWebcamDialogOpen, setIsWebcamDialogOpen] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);

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
    return filteredVenues.length > 0 ? filteredVenues : allVenues.slice(0,5); 
  }, [selectedMood, filteredVenues]);

  const handleSelfieCapture = (imageDataUrl: string) => {
    console.log("Selfie captured!", imageDataUrl.substring(0, 30) + "..."); // Log a snippet
    setCapturedSelfie(imageDataUrl);
    // You could potentially upload this image or use it in the NightPlanGenerator
    setIsWebcamDialogOpen(false); // Close dialog after capture
  };

  return (
    <div className="min-h-screen bg-brand-deep-black text-foreground p-4 md:p-8 selection:bg-neon-pink selection:text-white">
      <div className="container mx-auto">
        <Header />

        {/* Auth Status and Actions */}
        <div className="flex justify-end items-center my-4 sm:my-6 space-x-4"> {/* Adjusted margin */}
          {authLoading ? (
            <span className="text-gray-400">Loading user...</span>
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

        {/* MoodSelector */}
        <MoodSelector selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        
        {/* Map Section */}
        <div className="mt-8 mb-12">
           <h3 className="text-3xl font-semibold mb-8 text-center neon-text-teal animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Find Your Vibe on the Map
            </h3>
          <VenueMap 
            venues={venuesForMap} 
            apiKey={GOOGLE_MAPS_API_KEY}
            defaultCenter={ST_AUGUSTINE_COORDS}
            defaultZoom={13}
          />
        </div>

        {/* Filtered Venues Section */}
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

        <NightPlanGenerator />

        {/* Webcam Lightbox Trigger Section */}
        <div className="my-12 text-center animate-fade-in-up" style={{animationDelay: '1.2s'}}>
          <h3 className="text-3xl font-semibold mb-6 neon-text-lavender">Share Your Vibe!</h3>
          <p className="text-lg text-gray-400 mb-6">
            Capture a selfie to personalize your night out recommendations.
          </p>
          <Dialog open={isWebcamDialogOpen} onOpenChange={setIsWebcamDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="border-neon-lavender text-neon-lavender hover:bg-neon-lavender/20 hover:text-white animate-subtle-pulse">
                <VideoIcon className="mr-2 h-5 w-5" /> Open Webcam & Take Selfie
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] bg-brand-deep-black border-neon-teal p-0">
              <WebcamLightbox 
                onClose={() => setIsWebcamDialogOpen(false)}
                onImageCapture={handleSelfieCapture}
              />
            </DialogContent>
          </Dialog>
          {capturedSelfie && (
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 neon-text-teal">Your Awesome Selfie:</h4>
              <img src={capturedSelfie} alt="Your captured selfie" className="mx-auto rounded-lg shadow-lg max-w-xs border-2 border-neon-pink" />
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Index;
