
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
import { Loader2 } from 'lucide-react';
import PromptCarousel from '@/components/PromptCarousel';
import NightPlanDisplay from './NightPlanDisplay';
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';
import VibeAgentMessage from './VibeAgentMessage';

const NightPlanGenerator: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null);
  const [agentMessage, setAgentMessage] = useState<string>("Hey there! Looking for an adventure? What's your vibe tonight? Feel free to add more details below!");
  
  // State for the new input fields
  const [budget, setBudget] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  const [numPeople, setNumPeople] = useState<string>("1"); // Default to 1 person

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
    // Use the state values for budget, time, and numPeople
    generatePlan(budget, timeOfDay, numPeople, selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardContent className="space-y-8 py-8">
        
        <VibeAgentMessage message={agentMessage} avatarSrc={aiAvatarSrc} />

        <div className="mb-6"> 
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>

        {/* New Input Fields */}
        <div className="space-y-6 px-4 md:px-8 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="budget" className="text-gray-300 mb-1 block">Budget (Optional)</Label>
              <Input
                id="budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $50, moderate"
                className="bg-brand-charcoal/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-neon-pink focus:ring-neon-pink"
              />
            </div>
            <div>
              <Label htmlFor="timeOfDay" className="text-gray-300 mb-1 block">Time (Optional)</Label>
              <Input
                id="timeOfDay"
                type="text"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                placeholder="e.g., evening, 9 PM"
                className="bg-brand-charcoal/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-neon-pink focus:ring-neon-pink"
              />
            </div>
            <div>
              <Label htmlFor="numPeople" className="text-gray-300 mb-1 block">People</Label>
              <Input
                id="numPeople"
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                placeholder="e.g., 2"
                min="1"
                className="bg-brand-charcoal/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-neon-pink focus:ring-neon-pink"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8"> {/* Added mt-8 for spacing */}
            <Button
                onClick={handleFormSubmit}
                disabled={isLoading || !selectedMood} // Button is disabled if no mood is selected or if loading
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
