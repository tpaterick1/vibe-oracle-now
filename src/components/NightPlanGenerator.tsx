import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import PromptCarousel from '@/components/PromptCarousel';
import NightPlanDisplay from './NightPlanDisplay';
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';
import VibeAgentMessage from './VibeAgentMessage';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NightPlanGenerator: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [agentMessage, setAgentMessage] = useState<string>("Hey there! Looking for an adventure? What's your vibe tonight? Feel free to add more details below!");
  
  const aiAvatarSrc = "https://source.unsplash.com/1535268647677-300dbf3d78d1";

  const { 
    generatedPlan, 
    parsedPlanData, 
    isLoading, 
    error, 
    generatePlan 
  } = useNightPlanGeneration();

  useEffect(() => {
    if (additionalDetails && selectedMood) {
      setAgentMessage(`Got it, a ${selectedMood} night with some specifics! Anything else before we craft your quest?`);
    } else if (additionalDetails && !selectedMood) {
      setAgentMessage(`Interesting details... now, what's the main vibe for tonight?`);
    } else if (!additionalDetails && selectedMood) {
      setAgentMessage(`Thinking about a ${selectedMood} night? Awesome! Add any other details and let's craft your quest!`);
    } else {
      setAgentMessage("Hey there! Looking for an adventure? What's your vibe tonight? Feel free to add more details below!");
    }
  }, [additionalDetails, selectedMood]);

  const handleSelectMood = (mood: Vibe) => {
    setSelectedMood(prevMood => {
      const newMood = prevMood === mood ? null : mood;
      if (newMood === null) { // Deselecting
        if (additionalDetails) {
          setAgentMessage(`Okay, no specific vibe chosen, but I see your notes. What's the mood?`);
        } else {
          setAgentMessage(`Okay, no worries! What's your vibe then?`);
        }
      } else { // Selecting or changing mood
        if (additionalDetails) {
          setAgentMessage(`A ${newMood} night with those details sounds great! Ready to go?`);
        } else {
          setAgentMessage(`Thinking about a ${newMood} night? Awesome! Add any other details and let's craft your quest!`);
        }
      }
      return newMood;
    });
  };

  const handleFormSubmit = () => {
    generatePlan("", "", "1", selectedMood, additionalDetails); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-pink animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardContent className="space-y-8 py-8">
        
        <VibeAgentMessage message={agentMessage} avatarSrc={aiAvatarSrc} />

        <div className="mb-6"> 
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>

        {/* Textarea for additional details */}
        <div className="space-y-2">
          <Label htmlFor="additional-details" className="text-lg font-semibold text-white">
            Any other details? (Optional)
          </Label>
          <Textarea
            id="additional-details"
            placeholder="e.g., looking for live music, a quiet place, something near downtown, celebrating a birthday..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-pink min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-center mt-8">
            <Button
                onClick={handleFormSubmit}
                disabled={isLoading || (!selectedMood && !additionalDetails)}
                className="w-full max-w-xs bg-neon-pink hover:bg-pink-700 text-white font-semibold py-3 text-lg"
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
