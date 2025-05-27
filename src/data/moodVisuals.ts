
import React from 'react';
import { 
  Star, Heart, Circle, ChevronUp, EyeOff, Clock, Compass, Lightbulb, PartyPopper, Music2, Utensils,
  Activity,
  Sun as BeachIcon, // Changed Beach to Sun and aliased as BeachIcon
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
  "Beach": BeachIcon, // Using the aliased Sun icon
  "Hobby": Hobby,
  "Activity": Activity,
};

export type BusynessLevel = "empty" | "light" | "medium" | "busy" | "on_fire";

// Example using actual emojis:
// export const busynessEmojis: Record<BusynessLevel, string> = {
//   "empty": "💨",
//   "light": "✨",
//   "medium": "🙂",
//   "busy": "🎉",
//   "on_fire": "🔥",
// };

export const busynessEmojis: Record<BusynessLevel, string> = {
  "empty": "썰렁", // Could be an emoji like 💨 or 🧊
  "light": "한산", // ✨ or 😊
  "medium": "보통", // 👍 or 🙂
  "busy": "북적", // 🔥 or 🎉
  "on_fire": "핫플", // 🚀 or 🤩
};

