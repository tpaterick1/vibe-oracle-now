
import React from 'react';
import { 
  Star, Heart, Circle, ChevronUp, EyeOff, Clock, Compass, Lightbulb, PartyPopper, Music2, Utensils,
  Activity,
  Sun as BeachIcon,
  Beer as Bar,
  CookingPot as Restaurant,
  Puzzle as Hobby
} from 'lucide-react';
import { Vibe } from '@/data/venues';

export const moodIcons: Record<Vibe, React.ElementType> = {
  "Alive": Star,
  "Romantic": Heart,
  "Peaceful": Circle,
  "Energetic": ChevronUp,
  "Mysterious": EyeOff,
  "Chill": Clock,
  "Adventurous": Compass,
  "Intellectual": Lightbulb,
  "Festive": PartyPopper,
  "Groovy": Music2,
  "Gourmet": Utensils,
  // New Icons
  "Bar": Bar,
  "Restaurant": Restaurant,
  "Beach": BeachIcon,
  "Hobby": Hobby,
  "Activity": Activity,
};

export type BusynessLevel = "empty" | "light" | "medium" | "busy" | "on_fire";

export const busynessEmojis: Record<BusynessLevel, string> = {
  "empty": "🧊",    // Changed from "썰렁"
  "light": "✨",    // Kept as is (example, was "한산")
  "medium": "🙂",   // Kept as is (example, was "보통")
  "busy": "🎉",    // Kept as is (example, was "북적")
  "on_fire": "🔥",   // Changed from "핫플"
};

