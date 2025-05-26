
import React from 'react';
import { moods, Vibe } from '@/data/venues'; // moods is an array of objects { name: Vibe, color: string, shadow: string }
import { Button } from '@/components/ui/button'; // Using shadcn Button
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selectedMood: Vibe | null;
  onSelectMood: (mood: Vibe) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="my-8 animate-fade-in-up animation-delay-400">
      <h2 className="text-3xl font-bold mb-8 text-center neon-text-lavender tracking-tight animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        How are you feeling tonight?
      </h2>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {moods.map((mood, index) => (
          <Button
            key={mood.name}
            variant="outline"
            onClick={() => onSelectMood(mood.name)}
            className={cn(
              "text-lg px-6 py-5 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105",
              "glassmorphism-card border-opacity-50 hover:border-opacity-100",
              selectedMood === mood.name
                ? `${mood.color} text-white ${mood.shadow} border-transparent scale-105`
                : "text-gray-300 border-gray-600 hover:text-white",
              `hover:${mood.color} hover:border-transparent hover:${mood.shadow}`
            )}
            style={{ animationDelay: `${index * 100}ms` }} // This animation delay is for the button's appearance within the already animated div
          >
            {mood.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
