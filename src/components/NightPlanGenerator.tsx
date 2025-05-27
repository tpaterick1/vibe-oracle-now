
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button
import { Loader2 } from 'lucide-react'; // Added Loader2
import PromptCarousel from '@/components/PromptCarousel';
import NightPlanDisplay from './NightPlanDisplay'; // Keep NightPlanDisplay
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';

const NightPlanGenerator: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);

  const { 
    generatedPlan, 
    parsedPlanData, 
    isLoading, 
    error, 
    generatePlan 
  } = useNightPlanGeneration();

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
  };

  const handleFormSubmit = () => {
    // Pass default/placeholder values for budget, time, numPeople
    // as the hook useNightPlanGeneration (read-only) still expects them.
    generatePlan("", "", "1", selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardContent className="space-y-8 py-8">
        <div className="mb-6"> 
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>
        
        <div className="flex justify-center">
            <Button
                onClick={handleFormSubmit}
                disabled={isLoading || !selectedMood} // Also disable if no mood is selected
                className="w-full max-w-xs bg-neon-purple hover:bg-fuchsia-600 text-white font-semibold py-3 text-lg"
            >
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Crafting Your Quest...
                </>
                ) : (
                "Craft My Quest!"
                )}
            </Button>
        </div>
        {error && <p className="text-neon-red text-center mt-4">{error}</p>}

      </CardContent>
      
      {parsedPlanData && (
        <CardFooter>
            <NightPlanDisplay parsedPlanData={parsedPlanData} generatedPlan={generatedPlan} />
        </CardFooter>
      )}
    </Card>
  );
};

export default NightPlanGenerator;
