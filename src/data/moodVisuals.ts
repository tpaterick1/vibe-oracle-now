
import React from 'react';
import { Star, Heart, Circle, ChevronUp, EyeOff, Clock, Compass, Lightbulb } from 'lucide-react';
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
};

export type BusynessLevel = "empty" | "light" | "medium" | "busy" | "on_fire";

export const busynessEmojis: Record<BusynessLevel, string> = {
  "empty": "썰렁", // Could be an emoji like 💨 or 🧊
  "light": "한산", // ✨ or 😊
  "medium": "보통", // 👍 or 🙂
  "busy": "북적", // 🔥 or 🎉
  "on_fire": "핫플", // 🚀 or 🤩
};

// Example using actual emojis:
// export const busynessEmojis: Record<BusynessLevel, string> = {
//   "empty": "💨",
//   "light": "✨",
//   "medium": "🙂",
//   "busy": "🎉",
//   "on_fire": "🔥",
// };

