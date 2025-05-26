
export type Vibe = "Alive" | "Romantic" | "Peaceful" | "Energetic" | "Chill" | "Mysterious" | "Adventurous" | "Intellectual";

export interface Venue {
  id: string;
  name: string;
  vibeTags: Vibe[]; // This is mapped from vibe_tags and elements are cast to Vibe
  story: string | null;
  image: string | null;
  neonColorClass: string | null; // This is mapped from neon_color_class
  textColorClass: string | null; // This is mapped from text_color_class
  lat: number;
  lng: number;
  created_at: string; // Added from Supabase
  updated_at: string; // Added from Supabase
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
