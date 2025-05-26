
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Still used as a fallback
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Utensils, MapPin, Star, type LucideIcon } from 'lucide-react'; // Added icons
import { supabase } from '@/integrations/supabase/client';

// Interface for parsed plan items
interface ParsedPlanItem {
  icon: LucideIcon;
  title: string;
  teaser: string;
  fullText: string;
}

// Interface for the whole parsed plan structure
interface ParsedPlanData {
  items: ParsedPlanItem[];
  mainTitle: string;
  tipsSection: string;
  outroText: string;
}

// Helper function to parse the Markdown plan
const parsePlanFromMarkdown = (markdownText: string): ParsedPlanData => {
  const items: ParsedPlanItem[] = [];
  let mainTitle = "Your AI-Crafted Plan"; // Default main title
  let tipsSection = "";
  let outroText = "";

  if (!markdownText) return { items, mainTitle, tipsSection, outroText };

  const lines = markdownText.split('\n');
  
  const itemTitleRegex = /^\s*\*\*(?:\d+\.\s*)?(.+?)\*\*\s*$/; // Matches **1. Title** or **Title**
  const tipsHeaderRegex = /^###\s*Budget-Friendly Tips:/i;
  const mainPlanTitleRegex = /^###\s*(Night Out Plan.*|Your AI-Crafted Plan.*)/i; // Catches common main titles

  let currentRawItemTitle = "";
  let accumulatedTextForCurrentItem = "";
  let capturingTips = false;
  let planStarted = false; // To help decide if text is part of outro or pre-amble

  const extractTeaser = (text: string): string => {
    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim() !== ""); // Split by sentence-ending punctuation
    if (sentences.length === 0) return "";
    let teaser = sentences.slice(0, 2).join(' ');
    // Ensure teaser ends with punctuation if it's not the full text
    if (sentences.length > 2 || (sentences.length <=2 && !text.trim().endsWith(teaser.trim().slice(-1)))) {
        if (!/[.?!]$/.test(teaser)) {
             // Find the last punctuation in original sentence if available, or add a period.
            const originalEnd = sentences[Math.min(sentences.length, 2)-1].trim().slice(-1);
            if (/[.?!]/.test(originalEnd)) {
                teaser += originalEnd;
            } else {
                teaser += '.';
            }
        }
    }
    return teaser.trim();
  };

  const assignIcon = (title: string): LucideIcon => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('dinner') || lowerTitle.includes('food') || lowerTitle.includes('eat') || lowerTitle.includes('restaurant') || lowerTitle.includes('cuisine')) {
      return Utensils;
    }
    if (lowerTitle.includes('tour') || lowerTitle.includes('visit') || lowerTitle.includes('explore') || lowerTitle.includes('ghost') || lowerTitle.includes('walk') || lowerTitle.includes('history')) {
      return MapPin;
    }
    if (lowerTitle.includes('drinks') || lowerTitle.includes('bar') || lowerTitle.includes('lounge') || lowerTitle.includes('cocktails') || lowerTitle.includes('pub')) {
      return Star; // Using Star as a generic icon for drinks/nightlife spots
    }
    return Star; // Default icon
  };

  for (const line of lines) {
    const planTitleMatch = !planStarted && line.match(mainPlanTitleRegex);
    if (planTitleMatch) {
        mainTitle = planTitleMatch[1].trim();
        planStarted = true;
        continue;
    }

    const itemTitleMatch = line.match(itemTitleRegex);
    if (itemTitleMatch) {
        if (currentRawItemTitle && accumulatedTextForCurrentItem.trim()) {
            items.push({
                title: currentRawItemTitle,
                teaser: extractTeaser(accumulatedTextForCurrentItem.trim()),
                fullText: accumulatedTextForCurrentItem.trim(),
                icon: assignIcon(currentRawItemTitle),
            });
        }
        currentRawItemTitle = itemTitleMatch[1].trim();
        accumulatedTextForCurrentItem = "";
        capturingTips = false;
        planStarted = true;
        continue;
    }

    const tipsMatch = line.match(tipsHeaderRegex);
    if (tipsMatch) {
        if (currentRawItemTitle && accumulatedTextForCurrentItem.trim()) {
             items.push({
                title: currentRawItemTitle,
                teaser: extractTeaser(accumulatedTextForCurrentItem.trim()),
                fullText: accumulatedTextForCurrentItem.trim(),
                icon: assignIcon(currentRawItemTitle),
            });
            currentRawItemTitle = "";
            accumulatedTextForCurrentItem = "";
        }
        capturingTips = true;
        tipsSection += line + "\n";
        planStarted = true;
        continue;
    }

    if (currentRawItemTitle && !capturingTips) {
        accumulatedTextForCurrentItem += line + "\n";
    } else if (capturingTips) {
        tipsSection += line + "\n";
    } else if (planStarted && line.trim()) { 
        // If plan has started (either items, tips, or main title seen) and not part of current item/tips
        outroText += line + "\n";
    } else if (!planStarted && line.trim().toLowerCase().startsWith("enjoy")) { // Catch common outro start
        outroText += line + "\n";
        planStarted = true; // Assume plan is starting if we see an outro like this early
    }
  }
  
  if (currentRawItemTitle && accumulatedTextForCurrentItem.trim()) {
    items.push({
        title: currentRawItemTitle,
        teaser: extractTeaser(accumulatedTextForCurrentItem.trim()),
        fullText: accumulatedTextForCurrentItem.trim(),
        icon: assignIcon(currentRawItemTitle),
    });
  }
  
  tipsSection = tipsSection.trim();
  outroText = outroText.trim();

  // If mainTitle is still default but there's an intro line in `outroText`, use that for mainTitle.
  // This happens if the first `### Title` wasn't matched by `mainPlanTitleRegex`.
  if (mainTitle === "Your AI-Crafted Plan" && items.length > 0 && outroText) {
      const potentialTitle = outroText.split('\n')[0];
      if (potentialTitle.length < 80 && !potentialTitle.toLowerCase().startsWith("enjoy")) { // Heuristic for a title
          mainTitle = potentialTitle;
          outroText = outroText.substring(outroText.indexOf('\n') + 1).trim();
      }
  }


  return { items, mainTitle, tipsSection, outroText };
};


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
    setParsedPlanData(null); // Reset parsed data

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
      setParsedPlanData(null); // Clear parsed data on error
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
      
      {/* Updated plan display section */}
      {parsedPlanData && (
        <CardFooter className="flex-col items-start space-y-4 bg-brand-charcoal p-6 rounded-b-lg"> {/* Changed background, added padding */}
          <h4 className="text-xl font-semibold text-neon-purple w-full">{parsedPlanData.mainTitle}</h4>
          
          {parsedPlanData.items.length > 0 && (
            <div className="space-y-4 w-full">
              {parsedPlanData.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 p-4 bg-brand-deep-black rounded-lg shadow-lg hover:shadow-neon-purple/40 transition-shadow duration-300"
                >
                  <item.icon className="h-7 w-7 text-neon-teal mt-1 flex-shrink-0" />
                  <div className="flex-grow">
                    <h5 className="font-semibold text-white text-lg mb-1">{item.title}</h5>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.teaser}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {parsedPlanData.tipsSection && (
              <div className="mt-3 p-4 bg-brand-deep-black rounded-lg shadow-lg w-full">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{parsedPlanData.tipsSection}</pre>
              </div>
          )}

          {parsedPlanData.outroText && (
              <div className="mt-3 p-4 bg-brand-deep-black rounded-lg shadow-lg w-full">
                   <p className="text-sm text-gray-300 italic">{parsedPlanData.outroText}</p>
              </div>
          )}

          {/* Fallback to raw Textarea if parsing fails to produce items but raw plan exists */}
          {generatedPlan && parsedPlanData.items.length === 0 && !parsedPlanData.tipsSection && !parsedPlanData.outroText && (
            <Textarea
              value={generatedPlan}
              readOnly
              rows={8}
              className="w-full bg-brand-deep-black border-gray-700 text-gray-200 p-3 rounded-md whitespace-pre-wrap mt-2"
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NightPlanGenerator;

