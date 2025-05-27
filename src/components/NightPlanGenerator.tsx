
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import PromptCarousel from '@/components/PromptCarousel';
import NightPlanDisplay from './NightPlanDisplay';
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';
import VibeAgentMessage from './VibeAgentMessage';

const NightPlanGenerator: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const [agentMessage, setAgentMessage] = useState<string>("Hey there! Looking for an adventure? What's your vibe tonight?");
  
  // Placeholder image for the AI avatar (grey tabby kitten)
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
    setAgentMessage(`Thinking about a ${mood} night? Let's see...`);
  };

  const handleFormSubmit = () => {
    generatePlan("", "", "1", selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardContent className="space-y-8 py-8">
        
        <VibeAgentMessage message={agentMessage} avatarSrc={aiAvatarSrc} />

        <div className="mb-6"> 
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>
        
        <div className="flex justify-center">
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

