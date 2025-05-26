
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MoodSelector from '@/components/MoodSelector';
import VenueCard from '@/components/VenueCard';
import { venues as allVenues, Venue, Vibe } from '@/data/venues';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood); // Toggle mood or clear if same is clicked
  };

  const filteredVenues = useMemo(() => {
    if (!selectedMood) {
      // Show a curated selection or all if no mood is selected initially. Let's show some diverse ones.
      return allVenues.slice(0, 3); 
    }
    return allVenues.filter(venue => venue.vibeTags.includes(selectedMood));
  }, [selectedMood]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredVenues.map((venue, index) => (
                <VenueCard key={venue.id} venue={venue} index={index} />
              ))}
            </div>
          </div>
        )}

        {selectedMood && filteredVenues.length === 0 && (
           <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <p className="text-2xl text-gray-400">No venues match the "{selectedMood}" vibe right now.</p>
            <p className="text-lg text-gray-500 mt-2">Try another vibe or check back later!</p>
          </div>
        )}
      </div>
      <footer className="text-center py-8 mt-12 border-t border-gray-800">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} StAugustineTonight. All rights reserved.</p>
        <p className="text-sm text-gray-600 mt-1">Find your vibe, discover your night.</p>
      </footer>
    </div>
  );
};

export default Index;
