
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

// Define a type for individual mood objects
export interface Mood {
  name: Vibe;
  color: string;
  shadow: string;
  textColorClass: string;
}

// Define a type for mood categories
export interface MoodCategory {
  name: string;
  moods: Mood[];
}

// Categorized moods
export const categorizedMoods: MoodCategory[] = [
  {
    name: "How do you want to feel?",
    moods: [
      { name: "Alive", color: "bg-neon-blue", shadow: "shadow-neon-blue", textColorClass: "neon-text-blue" },
      { name: "Romantic", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" },
      { name: "Peaceful", color: "bg-neon-teal", shadow: "shadow-neon-teal", textColorClass: "neon-text-teal" },
      { name: "Energetic", color: "bg-neon-pink", shadow: "shadow-neon-pink", textColorClass: "neon-text-pink" },
      { name: "Chill", color: "bg-neon-lavender", shadow: "shadow-neon-lavender", textColorClass: "neon-text-lavender" },
      { name: "Mysterious", color: "bg-neon-purple", shadow: "shadow-neon-purple", textColorClass: "neon-text-purple" },
      { name: "Festive", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" },
      { name: "Groovy", color: "bg-neon-indigo", shadow: "shadow-neon-indigo", textColorClass: "neon-text-indigo" },
      { name: "Adventurous", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" },
    ]
  },
  {
    name: "What's going on?", // Updated category name
    moods: [
      { name: "Bar", color: "bg-neon-orange", shadow: "shadow-neon-orange", textColorClass: "neon-text-orange" },
      { name: "Restaurant", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" },
      { name: "Gourmet", color: "bg-neon-red", shadow: "shadow-neon-red", textColorClass: "neon-text-red" },
      { name: "Beach", color: "bg-neon-blue", shadow: "shadow-neon-blue", textColorClass: "neon-text-blue" },
      { name: "Hobby", color: "bg-neon-lavender", shadow: "shadow-neon-lavender", textColorClass: "neon-text-lavender" },
      { name: "Activity", color: "bg-neon-pink", shadow: "shadow-neon-pink", textColorClass: "neon-text-pink" },
      { name: "Intellectual", color: "bg-neon-indigo", shadow: "shadow-neon-indigo", textColorClass: "neon-text-indigo" },
    ]
  }
];

// The old flat 'moods' array is replaced by 'categorizedMoods'
// The static 'venues' array has been removed as data is now fetched from Supabase.
