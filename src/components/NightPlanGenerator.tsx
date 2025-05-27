
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Input and Label are no longer needed directly here for budget, time, people
import { Loader2 } from 'lucide-react';
import PromptCarousel from '@/components/PromptCarousel';
import NightPlanDisplay from './NightPlanDisplay';
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';
import VibeAgentMessage from './VibeAgentMessage';

const NightPlanGenerator: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const [agentMessage, setAgentMessage] = useState<string>("Hey there! Looking for an adventure? What's your vibe tonight? Feel free to add more details below!");
  
  // Removed budget, timeOfDay, numPeople states

  const aiAvatarSrc = "https://source.unsplash.com/1535268647677-300dbf3d78d1";

  const { 
    generatedPlan, 
    parsedPlanData, 
    isLoading, 
    error, 
    generatePlan 
  } = useNightPlanGeneration();

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
    if (selectedMood === mood) { // Deselecting
      setAgentMessage(`Okay, no worries! What's your vibe then?`);
    } else { // Selecting
      setAgentMessage(`Thinking about a ${mood} night? Awesome! Add any other details and let's craft your quest!`);
    }
  };

  const handleFormSubmit = () => {
    // Pass empty strings for budget/time and "1" for numPeople as defaults
    generatePlan("", "", "1", selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardContent className="space-y-8 py-8">
        
        <VibeAgentMessage message={agentMessage} avatarSrc={aiAvatarSrc} />

        <div className="mb-6"> 
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>

        {/* Input Fields for budget, time, and people have been removed */}
        
        <div className="flex justify-center mt-8">
            <Button
                onClick={handleFormSubmit}
                disabled={isLoading || !selectedMood}
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
