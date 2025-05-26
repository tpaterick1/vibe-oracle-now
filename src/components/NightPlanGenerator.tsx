
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client

const NightPlanGenerator: React.FC = () => {
  // Removed apiKey state as it's handled by the Edge Function
  const [budget, setBudget] = useState<string>('moderate');
  const [time, setTime] = useState<string>('evening');
  const [numPeople, setNumPeople] = useState<string>('2');
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan('');

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
      } else if (data && data.error) { // Handle errors returned in the data payload from the Edge Function
        throw new Error(data.error);
      } 
       else {
        throw new Error("No plan generated or unexpected response structure from Edge Function.");
      }
    } catch (err: any) {
      console.error("Error generating plan:", err);
      setError(err.message || "Failed to generate plan. Check console for details.");
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
        {/* Removed API Key input field */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-gray-300">Budget</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $, $$, $$$ or casual, moderate, fancy"
              className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-gray-300">Time of Night</Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., Evening, Late Night"
              className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numPeople" className="text-gray-300">Number of People</Label>
            <Input
              id="numPeople"
              type="number"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              placeholder="e.g., 2"
              min="1"
              className="bg-brand-charcoal border-gray-700 text-white placeholder-gray-500 focus:border-neon-purple"
            />
          </div>
        </div>
        <Button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="w-full bg-neon-purple hover:bg-fuchsia-600 text-white font-semibold py-3 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Plan with OpenAI"
          )}
        </Button>
        {error && <p className="text-neon-red text-center mt-4">{error}</p>}
      </CardContent>
      {generatedPlan && (
        <CardFooter className="flex-col items-start space-y-2">
           <h4 className="text-xl font-semibold text-neon-purple">Your AI-Crafted Plan (via OpenAI):</h4>
          <Textarea
            value={generatedPlan}
            readOnly
            rows={8}
            className="w-full bg-brand-deep-black border-gray-700 text-gray-200 p-3 rounded-md whitespace-pre-wrap"
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default NightPlanGenerator;
