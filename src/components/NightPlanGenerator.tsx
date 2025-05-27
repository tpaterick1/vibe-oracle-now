
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import NightPlanForm from './NightPlanForm';
import NightPlanDisplay from './NightPlanDisplay';
import { useNightPlanGeneration } from '@/hooks/useNightPlanGeneration'; // Import the new hook

const NightPlanGenerator: React.FC = () => {
  const [budget, setBudget] = useState<string>('moderate');
  const [time, setTime] = useState<string>('evening');
  const [numPeople, setNumPeople] = useState<string>('2');

  // Use the custom hook for plan generation logic and state
  const { 
    generatedPlan, 
    parsedPlanData, 
    isLoading, 
    error, 
    generatePlan 
  } = useNightPlanGeneration();

  const handleFormSubmit = () => {
    generatePlan(budget, time, numPeople);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-12 glassmorphism-card border-neon-purple animate-fade-in-up" style={{animationDelay: '1.2s'}}>
      <CardHeader>
        <CardTitle className="neon-text-purple text-2xl md:text-3xl text-center">Generate Your Perfect Night Out</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Let AI craft a personalized plan for your St. Augustine adventure!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NightPlanForm
          budget={budget}
          setBudget={setBudget}
          time={time}
          setTime={setTime}
          numPeople={numPeople}
          setNumPeople={setNumPeople}
          handleGeneratePlan={handleFormSubmit} // Pass the new handler
          isLoading={isLoading} // Get from hook
          error={error} // Get from hook
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

