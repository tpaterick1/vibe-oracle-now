
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParsedPlanData, parsePlanFromMarkdown } from '@/utils/planParsingUtils';
import { Vibe } from '@/data/venues'; // Ensure Vibe is available if needed for type, or use string

interface UseNightPlanGenerationReturn {
  generatedPlan: string;
  parsedPlanData: ParsedPlanData | null;
  isLoading: boolean;
  error: string | null;
  generatePlan: (budget: string, time: string, numPeople: string, mood: Vibe | null) => Promise<void>; // Added mood
}

export const useNightPlanGeneration = (): UseNightPlanGenerationReturn => {
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [parsedPlanData, setParsedPlanData] = useState<ParsedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(async (budget: string, time: string, numPeople: string, mood: Vibe | null) => { // Added mood
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    setParsedPlanData(null);

    try {
      console.log("Invoking Supabase Edge Function 'generate-night-plan-openai' from hook with params:", { budget, time, numPeople, mood });
      const { data, error: functionError } = await supabase.functions.invoke('generate-night-plan-openai', {
        body: { budget, time, numPeople, mood }, // Added mood to body
      });

      console.log("Edge Function response data (hook):", data);
      console.log("Edge Function error (hook):", functionError);

      if (functionError) {
        throw new Error(functionError.message || "Failed to invoke Edge Function.");
      }

      if (data && data.plan) {
        setGeneratedPlan(data.plan);
        const parsed = parsePlanFromMarkdown(data.plan);
        setParsedPlanData(parsed);
        console.log("Parsed plan data (hook):", parsed);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No plan generated or unexpected response structure from Edge Function.");
      }
    } catch (err: any) {
      console.error("Error generating plan (hook):", err);
      setError(err.message || "Failed to generate plan. Check console for details.");
      setParsedPlanData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generatedPlan, parsedPlanData, isLoading, error, generatePlan };
};
