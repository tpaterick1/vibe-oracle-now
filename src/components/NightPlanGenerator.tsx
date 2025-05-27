
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Still used as a fallback
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Utensils, MapPin, Star, Lightbulb, Compass, type LucideIcon } from 'lucide-react'; // Added Lightbulb, Compass
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
  const mainPlanTitleRegex = /^###\s*(Night Out Plan.*|Your AI-Crafted Plan.*|Your Nightly Quest.*)/i; // Catches common main titles, added "Your Nightly Quest"

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
    if (lowerTitle.includes('tour') || lowerTitle.includes('visit') || lowerTitle.includes('explore') || lowerTitle.includes('ghost') || lowerTitle.includes('walk') || lowerTitle.includes('history') || lowerTitle.includes('sightseeing')) {
      return MapPin;
    }
    if (lowerTitle.includes('drinks') || lowerTitle.includes('bar') || lowerTitle.includes('lounge') || lowerTitle.includes('cocktails') || lowerTitle.includes('pub') || lowerTitle.includes('music') || lowerTitle.includes('live band')) {
      return Star; 
    }
    if (lowerTitle.includes('activity') || lowerTitle.includes('show') || lowerTitle.includes('event')) {
        return Compass;
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
        tipsSection += line + "\n"; // Keep the header for now, will be styled separately
        planStarted = true;
        continue;
    }

    if (currentRawItemTitle && !capturingTips) {
        accumulatedTextForCurrentItem += line + "\n";
    } else if (capturingTips) {
        tipsSection += line + "\n";
    } else if (planStarted && line.trim()) { 
        outroText += line + "\n";
    } else if (!planStarted && line.trim().toLowerCase().startsWith("enjoy")) { 
        outroText += line + "\n";
        planStarted = true; 
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

  if (mainTitle === "Your AI-Crafted Plan" && items.length > 0 && outroText) {
      const potentialTitle = outroText.split('\n')[0];
      if (potentialTitle.length < 80 && !potentialTitle.toLowerCase().startsWith("enjoy")) { 
          mainTitle = potentialTitle;
          outroText = outroText.substring(outroText.indexOf('\n') + 1).trim();
      }
  }
  if (mainTitle === "Your AI-Crafted Plan") mainTitle = "Your Nightly Quest!";


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
            "Craft My Quest!"
          )}
        </Button>
        {error && <p className="text-neon-red text-center mt-4">{error}</p>}
      </CardContent>
      
      {parsedPlanData && (
        <CardFooter className="flex-col items-start space-y-4 bg-brand-charcoal/50 p-4 md:p-6 rounded-b-lg">
          <h4 className="text-3xl font-bold text-neon-purple w-full text-center mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {parsedPlanData.mainTitle}
          </h4>
          
          {parsedPlanData.items.length > 0 && (
            <div className="relative w-full px-2 md:px-4 py-4">
              <div className="space-y-10"> {/* Increased space-y for better separation */}
                {parsedPlanData.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative pl-16 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150 + 300}ms` }}
                  >
                    {/* Path Connector Line element */}
                    {index > 0 && (
                      <div className="absolute left-[28px] bottom-[calc(100%_-_4px)] h-10 w-[3px] bg-neon-teal/60 transform -translate-x-1/2 rounded-full"></div>
                    )}
                    {index < parsedPlanData.items.length - 1 && (
                       <div className="absolute left-[28px] top-[calc(100%_-_4px)] h-10 w-[3px] bg-neon-teal/60 transform -translate-x-1/2 rounded-full"></div>
                    )}

                    {/* Step Number/Marker (Circle) */}
                    <div 
                      className="absolute top-[50%] left-[28px] transform -translate-y-1/2 -translate-x-1/2 z-10 
                                 h-14 w-14 bg-neon-teal rounded-full flex items-center justify-center 
                                 shadow-lg border-4 border-brand-deep-black ring-2 ring-neon-teal/50"
                    >
                      <span className="text-white font-bold text-2xl">{index + 1}</span>
                    </div>
                    
                    {/* Step Card Content */}
                    <div 
                      className="ml-0 p-5 md:p-6 bg-brand-deep-black/80 backdrop-blur-md rounded-xl shadow-xl hover:shadow-neon-purple/70 border border-neon-purple/40 hover:border-neon-purple/80 transition-all duration-300 ease-in-out transform hover:scale-[1.03] min-h-[120px] flex flex-col justify-center"
                    >
                      <div className="flex items-center mb-2">
                        <item.icon className="h-7 w-7 text-neon-teal mr-3 flex-shrink-0" />
                        <h5 className="font-semibold text-white text-xl md:text-2xl">{item.title}</h5>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">{item.teaser}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {parsedPlanData.tipsSection && (
              <div className="mt-8 w-full p-5 md:p-6 bg-brand-charcoal/80 backdrop-blur-md rounded-xl shadow-lg border border-neon-teal/40 animate-fade-in-up" style={{ animationDelay: `${(parsedPlanData.items.length) * 150 + 500}ms` }}>
                  <h5 className="flex items-center text-xl font-semibold text-neon-teal mb-3">
                      <Lightbulb className="h-6 w-6 mr-2" />
                      Helpful Hints
                  </h5>
                  <pre className="text-sm md:text-base text-gray-300 whitespace-pre-wrap font-sans">{parsedPlanData.tipsSection.replace(/^###\s*Budget-Friendly Tips:/i, '').trim()}</pre>
              </div>
          )}

          {parsedPlanData.outroText && (
              <div className="mt-6 w-full p-5 md:p-6 bg-brand-charcoal/80 backdrop-blur-md rounded-xl shadow-lg border border-neon-teal/40 animate-fade-in-up" style={{ animationDelay: `${(parsedPlanData.items.length) * 150 + 700}ms` }}>
                   <h5 className="flex items-center text-xl font-semibold text-neon-teal mb-3">
                      <Compass className="h-6 w-6 mr-2" />
                      Your Adventure Awaits!
                  </h5>
                   <p className="text-sm md:text-base text-gray-300 italic">{parsedPlanData.outroText}</p>
              </div>
          )}

          {generatedPlan && parsedPlanData.items.length === 0 && !parsedPlanData.tipsSection && !parsedPlanData.outroText && (
            <Textarea
              value={generatedPlan}
              readOnly
              rows={8}
              className="w-full bg-brand-deep-black border-gray-700 text-gray-200 p-3 rounded-md whitespace-pre-wrap mt-4"
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NightPlanGenerator;

