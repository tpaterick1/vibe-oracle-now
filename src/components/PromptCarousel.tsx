import React from 'react';
import { moods, Vibe } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moodIcons } from '@/data/moodVisuals';

interface PromptCarouselProps {
  selectedMood: Vibe | null;
  onSelectMood: (mood: Vibe) => void;
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="my-8 animate-fade-in-up animation-delay-400">
      <h2 className="text-3xl font-bold mb-8 text-center neon-text-lavender tracking-tight animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        What's the vibe for tonight? {/* Updated title */}
      </h2>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {moods.map((mood, index) => {
          const IconComponent = moodIcons[mood.name];
          return (
            <Button
              key={mood.name}
              variant="outline"
              onClick={() => onSelectMood(mood.name)}
              className={cn(
                "text-lg px-6 py-5 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105",
                "glassmorphism-card border-opacity-50 hover:border-opacity-100", // glassmorphism-card now provides default neon border
                selectedMood === mood.name
                  ? `${mood.color} text-white ${mood.shadow} border-transparent scale-105` // Selected: specific neon color, white text, its own shadow, transparent border (bg acts as border)
                  : "text-muted-foreground hover:text-white", // Not selected: muted text (light gray), hover to white text. Border comes from glassmorphism-card.
                `hover:${mood.color} hover:border-transparent hover:${mood.shadow}` // Hover: specific neon color, its shadow
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {IconComponent && <IconComponent className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
              {mood.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PromptCarousel;
