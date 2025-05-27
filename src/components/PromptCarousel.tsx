
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
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {moods.map((mood, index) => {
          const IconComponent = moodIcons[mood.name];
          const isSelected = selectedMood === mood.name;
          return (
            <Button
              key={mood.name}
              variant="outline"
              onClick={() => onSelectMood(mood.name)}
              className={cn(
                "text-lg px-6 py-5 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105",
                "glassmorphism-card border-opacity-50", // Base style
                isSelected
                  ? `${mood.color} ${mood.shadow} border-transparent scale-105 ${mood.textColorClass}` // Selected: mood bg, shadow, text color
                  : `text-muted-foreground hover:text-white hover:${mood.color} hover:border-transparent hover:${mood.shadow} hover:border-opacity-100 border-gray-700` // Not selected: muted text, specific hover
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {IconComponent && (
                <IconComponent className="mr-2 h-5 w-5 md:h-6 md:w-6" /> // Icon size increased
              )}
              {mood.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PromptCarousel;
