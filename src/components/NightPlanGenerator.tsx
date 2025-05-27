
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Removed CardHeader, CardTitle, CardDescription
import NightPlanForm from './NightPlanForm';
import NightPlanDisplay from './NightPlanDisplay';
import PromptCarousel from '@/components/PromptCarousel';
import { Vibe } from '@/data/venues';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration';

const NightPlanGenerator: React.FC = () => {
  const [budget, setBudget] = useState<string>('< $50');
  const [time, setTime] = useState<string>('Evening');
  const [numPeople, setNumPeople] = useState<string>('2');
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
    generatePlan(budget, time, numPeople, selectedMood); 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      {/* CardHeader has been removed */}
      <CardContent className="space-y-8 py-8">
        {/* PromptCarousel is now the first item */}
        <div className="mb-6"> 
          {/* Removed h3: "First, what's the vibe?" */}
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
