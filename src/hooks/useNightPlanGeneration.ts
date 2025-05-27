
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ParsedPlanData, parsePlanFromMarkdown } from '@/utils/planParsingUtils';

interface UseNightPlanGenerationReturn {
  generatedPlan: string;
  parsedPlanData: ParsedPlanData | null;
  isLoading: boolean;
  error: string | null;
  generatePlan: (budget: string, time: string, numPeople: string) => Promise<void>;
}

export const useNightPlanGeneration = (): UseNightPlanGenerationReturn => {
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [parsedPlanData, setParsedPlanData] = useState<ParsedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(async (budget: string, time: string, numPeople: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');
    setParsedPlanData(null);

    try {
      console.log("Invoking Supabase Edge Function 'generate-night-plan-openai' from hook...");
      const { data, error: functionError } = await supabase.functions.invoke('generate-night-plan-openai', {
        body: { budget, time, numPeople },
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

