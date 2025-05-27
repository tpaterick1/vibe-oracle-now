import React from 'react';
import { 
  Star, Heart, Circle, ChevronUp, EyeOff, Clock, Compass, Lightbulb, PartyPopper, Music2, Utensils,
  Activity, // New
  Beach,    // New
  Beer as Bar,       // Using Beer for Bar vibe, aliased as Bar
  CookingPot as Restaurant, // Using CookingPot for Restaurant, aliased
  Puzzle as Hobby    // New
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
  "Beach": Beach,
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
