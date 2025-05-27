import { BusynessLevel } from './moodVisuals'; // Added import

export type Vibe = 
  | "Alive" | "Romantic" | "Peaceful" | "Energetic" | "Chill" 
  | "Mysterious" | "Adventurous" | "Intellectual"
  | "Festive" | "Groovy" | "Gourmet"
  | "Bar" | "Restaurant" | "Beach" | "Hobby" | "Activity"; // Added new vibes

export interface Venue {
  id: string;
  name: string;
  vibeTags: Vibe[];
  story: string | null;
  image: string | null;
  neonColorClass: string | null;
  textColorClass: string | null; // This seems to be for VenueCard, not directly mood button icon
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  busyness?: BusynessLevel; 
}

export const moods: { name: Vibe; color: string; shadow: string; textColorClass: string; }[] = [
  { name: "Alive", color: "bg-neon-blue", shadow: "shadow-neon-blue", textColorClass: "neon-text-blue" },
  { name: "Romantic", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" },
  { name: "Peaceful", color: "bg-neon-teal", shadow: "shadow-neon-teal", textColorClass: "neon-text-teal" },
  { name: "Energetic", color: "bg-neon-pink", shadow: "shadow-neon-pink", textColorClass: "neon-text-pink" },
  { name: "Chill", color: "bg-neon-lavender", shadow: "shadow-neon-lavender", textColorClass: "neon-text-lavender" },
  { name: "Mysterious", color: "bg-neon-purple", shadow: "shadow-neon-purple", textColorClass: "neon-text-purple" },
  { name: "Adventurous", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" },
  { name: "Intellectual", color: "bg-neon-indigo", shadow: "shadow-neon-indigo", textColorClass: "neon-text-indigo" },
  { name: "Festive", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" }, // Re-using orange
  { name: "Groovy", color: "bg-neon-indigo", shadow: "shadow-neon-indigo", textColorClass: "neon-text-indigo" }, // Re-using indigo
  { name: "Gourmet", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" }, // Re-using red
  // New vibes with reused colors for now
  { name: "Bar", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" },
  { name: "Restaurant", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" },
  { name: "Beach", color: "bg-neon-blue", shadow: "shadow-neon-blue", textColorClass: "neon-text-blue" },
  { name: "Hobby", color: "bg-neon-lavender", shadow: "shadow-neon-lavender", textColorClass: "neon-text-lavender" },
  { name: "Activity", color: "bg-neon-pink", shadow: "shadow-neon-pink", textColorClass: "neon-text-pink" },
];

// The static 'venues' array has been removed as data is now fetched from Supabase.
