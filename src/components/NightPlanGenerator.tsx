
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import NightPlanForm from './NightPlanForm';
import NightPlanDisplay from './NightPlanDisplay';
import PromptCarousel from '@/components/PromptCarousel'; // Import PromptCarousel
import { Vibe } from '@/data/venues'; // Import Vibe
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';

const NightPlanGenerator: React.FC = () => {
  const [budget, setBudget] = useState<string>('moderate');
  const [time, setTime] = useState<string>('evening');
  const [numPeople, setNumPeople] = useState<string>('2');
  const [selectedMood, setSelectedMood] = useState<Vibe | null>(null); // Add state for selectedMood

  const { 
    generatedPlan, 
    parsedPlanData, 
    isLoading, 
    error, 
    generatePlan 
  } = useNightPlanGeneration();

  const handleSelectMood = (mood: Vibe) => { // Add handler for mood selection
    setSelectedMood(prevMood => prevMood === mood ? null : mood);
  };

  const handleFormSubmit = () => {
    // Pass selectedMood to generatePlan
    generatePlan(budget, time, numPeople, selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardHeader>
        <CardTitle className="neon-text-purple text-2xl md:text-3xl text-center">Generate Your Perfect Night Out</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Let AI craft a personalized plan for your St. Augustine adventure!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 py-8"> {/* Increased space-y and added py */}
        {/* Add PromptCarousel here */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-200">First, what's the vibe?</h3>
          <PromptCarousel selectedMood={selectedMood} onSelectMood={handleSelectMood} />
        </div>
        
        <NightPlanForm
          budget={budget}
          setBudget={setBudget}
          time={time}
          setTime={setTime}
          numPeople={numPeople}
          setNumPeople={setNumPeople}
          handleGeneratePlan={handleFormSubmit}
          isLoading={isLoading}
          error={error}
        />
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
