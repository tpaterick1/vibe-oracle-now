
import React from 'react';
import { Vibe, categorizedMoods, Mood } from '@/data/venues';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { moodIcons } from '@/data/moodVisuals';
import { WandSparkles } from 'lucide-react'; // Import the WandSparkles icon
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PromptCarouselProps {
  selectedMood: Vibe | null;
  onSelectMood: (mood: Vibe) => void;
}

const PromptCarousel: React.FC<PromptCarouselProps> = ({ selectedMood, onSelectMood }) => {
  const getDefaultAccordionValue = () => {
    if (selectedMood) {
      for (const category of categorizedMoods) {
        if (category.moods.some(mood => mood.name === selectedMood)) {
          return category.name;
        }
      }
    }
    return categorizedMoods.length > 0 ? categorizedMoods[0].name : undefined;
  };
  
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>(getDefaultAccordionValue());

  const handleMoodSelection = (moodName: Vibe, categoryName: string) => {
    onSelectMood(moodName);
    setOpenAccordionItem(categoryName); 
  };

  const handleSurpriseMe = (categoryMoods: Mood[], categoryName: string) => {
    if (categoryMoods.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryMoods.length);
      const randomMood = categoryMoods[randomIndex];
      handleMoodSelection(randomMood.name, categoryName);
    }
  };

  return (
    <div className="my-8 animate-fade-in-up animation-delay-400 w-full">
      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-3"
        value={openAccordionItem}
        onValueChange={setOpenAccordionItem}
      >
        {categorizedMoods.map((category, categoryIndex) => (
          <AccordionItem 
            value={category.name} 
            key={category.name} 
            className="glassmorphism-card border-opacity-30 border rounded-lg px-4"
          >
            <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline py-4">
              {category.name}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {category.moods.map((mood: Mood, moodIndex) => {
                  const IconComponent = moodIcons[mood.name];
                  const isSelected = selectedMood === mood.name;
                  return (
                    <Button
                      key={mood.name}
                      variant="outline"
                      onClick={() => handleMoodSelection(mood.name, category.name)}
                      className={cn(
                        "text-base px-4 py-3 md:text-lg md:px-6 md:py-5 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105",
                        "glassmorphism-card border-opacity-50", // Base style
                        isSelected
                          ? `${mood.color} ${mood.shadow} border-transparent scale-105 ${mood.textColorClass}` // Selected: mood bg, shadow, text color
                          : `text-muted-foreground hover:text-white hover:${mood.color} hover:border-transparent hover:${mood.shadow} hover:border-opacity-100 border-gray-700` // Not selected: muted text, specific hover
                      )}
                      style={{ animationDelay: `${(categoryIndex * 100) + (moodIndex * 50)}ms` }} // Stagger animation
                    >
                      {IconComponent && (
                        <IconComponent className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      )}
                      {mood.name}
                    </Button>
                  );
                })}
                {/* Surprise Me Button */}
                <Button
                  variant="outline"
                  onClick={() => handleSurpriseMe(category.moods, category.name)}
                  className={cn(
                    "text-base px-4 py-3 md:text-lg md:px-6 md:py-5 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105",
                    "glassmorphism-card border-opacity-50 text-muted-foreground hover:text-white hover:bg-neon-purple hover:border-transparent hover:shadow-neon-purple border-gray-700"
                  )}
                  style={{ animationDelay: `${(categoryIndex * 100) + (category.moods.length * 50)}ms` }} // Stagger animation
                >
                  <WandSparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Surprise Me
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PromptCarousel;
