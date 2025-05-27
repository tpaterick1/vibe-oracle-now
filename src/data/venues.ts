import { BusynessLevel } from './moodVisuals'; // Added import

export type Vibe = "Alive" | "Romantic" | "Peaceful" | "Energetic" | "Chill" | "Mysterious" | "Adventurous" | "Intellectual";

export interface Venue {
  id: string;
  name: string;
  vibeTags: Vibe[];
  story: string | null;
  image: string | null;
  neonColorClass: string | null;
  textColorClass: string | null;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  busyness?: BusynessLevel; // Added optional busyness property
}

export const moods: { name: Vibe; color: string, shadow: string }[] = [
  { name: "Alive", color: "bg-neon-blue", shadow: "shadow-neon-blue" },
  { name: "Romantic", color: "bg-neon-red", shadow: "shadow-neon-red" },
  { name: "Peaceful", color: "bg-neon-teal", shadow: "shadow-neon-teal" },
  { name: "Energetic", color: "bg-neon-pink", shadow: "shadow-neon-pink" },
  { name: "Chill", color: "bg-neon-lavender", shadow: "shadow-neon-lavender" },
  { name: "Mysterious", color: "bg-neon-purple", shadow: "shadow-neon-purple" },
  { name: "Adventurous", color: "bg-neon-orange", shadow: "shadow-neon-orange" },
  { name: "Intellectual", color: "bg-neon-indigo", shadow: "shadow-neon-indigo" },
];

// The static 'venues' array has been removed as data is now fetched from Supabase.
