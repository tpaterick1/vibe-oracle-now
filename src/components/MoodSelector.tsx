
import React from 'react';
import { moods, Vibe } from '@/data/venues'; // moods is an array of objects { name: Vibe, color: string, shadow: string }
import { Button } from '@/components/ui/button'; // Using shadcn Button
import { cn } from '@/lib/utils';
import { Star, Heart, Circle, ChevronUp, EyeOff, Clock, Compass, Lightbulb } from 'lucide-react'; // Import new icons

interface MoodSelectorProps {
  selectedMood: Vibe | null;
  onSelectMood: (mood: Vibe) => void;
}

// Define a mapping for mood names to icons
const moodIcons: Record<Vibe, React.ElementType> = {
  "Alive": Star,
  "Romantic": Heart,
  "Peaceful": Circle,
  "Energetic": ChevronUp,
  "Mysterious": EyeOff,
  "Chill": Clock,
  "Adventurous": Compass, // New icon
  "Intellectual": Lightbulb, // New icon
};


const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="my-8 animate-fade-in-up animation-delay-400">
      <h2 className="text-3xl font-bold mb-8 text-center neon-text-lavender tracking-tight animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        How are you feeling tonight?
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
                "glassmorphism-card border-opacity-50 hover:border-opacity-100",
                selectedMood === mood.name
                  ? `${mood.color} text-white ${mood.shadow} border-transparent scale-105`
                  : "text-gray-300 border-gray-600 hover:text-white",
                `hover:${mood.color} hover:border-transparent hover:${mood.shadow}`
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {IconComponent && <IconComponent className="mr-2 h-4 w-4 md:h-5 md:w-5" />} {/* Adjusted icon size */}
              {mood.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
