
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { ParsedPlanData, parsePlanFromMarkdown } from '@/utils/planParsingUtils';
import NightPlanForm from './NightPlanForm';
import NightPlanDisplay from './NightPlanDisplay';

const NightPlanGenerator: React.FC = () => {
  const [budget, setBudget] = useState<string>('moderate');
  const [time, setTime] = useState<string>('evening');
  const [numPeople, setNumPeople] = useState<string>('2');
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [parsedPlanData, setParsedPlanData] = useState<ParsedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    setParsedPlanData(null); 

    try {
      console.log("Invoking Supabase Edge Function 'generate-night-plan-openai'...");
      const { data, error: functionError } = await supabase.functions.invoke('generate-night-plan-openai', {
        body: { budget, time, numPeople },
      });

      console.log("Edge Function response data:", data);
      console.log("Edge Function error:", functionError);

      if (functionError) {
        throw new Error(functionError.message || "Failed to invoke Edge Function.");
      }

      if (data && data.plan) {
        setGeneratedPlan(data.plan);
        const parsed = parsePlanFromMarkdown(data.plan);
        setParsedPlanData(parsed);
        console.log("Parsed plan data:", parsed);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No plan generated or unexpected response structure from Edge Function.");
      }
    } catch (err: any) {
      console.error("Error generating plan:", err);
      setError(err.message || "Failed to generate plan. Check console for details.");
      setParsedPlanData(null); 
    } finally {
      setIsLoading(false);
    }
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
          handleGeneratePlan={handleGeneratePlan}
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
