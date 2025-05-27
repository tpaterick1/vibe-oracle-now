
import { type LucideIcon, Utensils, MapPin, Star, Compass } from 'lucide-react';

// Interface for parsed plan items
export interface ParsedPlanItem {
  icon: LucideIcon;
  title: string;
  teaser: string;
  fullText: string;
}

// Interface for the whole parsed plan structure
export interface ParsedPlanData {
  items: ParsedPlanItem[];
  mainTitle: string;
  tipsSection: string;
  outroText: string;
}

// Helper function to parse the Markdown plan
export const parsePlanFromMarkdown = (markdownText: string): ParsedPlanData => {
  const items: ParsedPlanItem[] = [];
  let mainTitle = "Your AI-Crafted Plan"; // Default main title
  let tipsSection = "";
  let outroText = "";

  if (!markdownText) return { items, mainTitle, tipsSection, outroText };

  const lines = markdownText.split('\n');
  
  const itemTitleRegex = /^\s*\*\*(?:\d+\.\s*)?(.+?)\*\*\s*$/; // Matches **1. Title** or **Title**
  const tipsHeaderRegex = /^###\s*Budget-Friendly Tips:/i;
  const mainPlanTitleRegex = /^###\s*(Night Out Plan.*|Your AI-Crafted Plan.*|Your Nightly Quest.*)/i;

  let currentRawItemTitle = "";
  let accumulatedTextForCurrentItem = "";
  let capturingTips = false;
  let planStarted = false;

  const extractTeaser = (text: string): string => {
    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim() !== "");
    if (sentences.length === 0) return "";
    let teaser = sentences.slice(0, 2).join(' ');
    if (sentences.length > 2 || (sentences.length <=2 && !text.trim().endsWith(teaser.trim().slice(-1)))) {
        if (!/[.?!]$/.test(teaser)) {
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
        tipsSection += line + "\n";
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
