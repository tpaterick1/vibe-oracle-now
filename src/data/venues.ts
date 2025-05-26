
export type Vibe = "Alive" | "Romantic" | "Peaceful" | "Energetic" | "Chill" | "Mysterious";

export interface Venue {
  id: string;
  name: string;
  vibeTags: Vibe[];
  story: string;
  image: string; // Placeholder for image URL
  neonColorClass: string; // Tailwind class for neon glow
  textColorClass: string; // Tailwind class for neon text
}

export const moods: { name: Vibe; color: string, shadow: string }[] = [
  { name: "Alive", color: "bg-neon-blue", shadow: "shadow-neon-blue" },
  { name: "Romantic", color: "bg-neon-red", shadow: "shadow-neon-red" },
  { name: "Peaceful", color: "bg-neon-teal", shadow: "shadow-neon-teal" },
  { name: "Energetic", color: "bg-neon-pink", shadow: "shadow-neon-pink" },
  { name: "Chill", color: "bg-neon-lavender", shadow: "shadow-neon-lavender" },
  { name: "Mysterious", color: "bg-neon-purple", shadow: "shadow-neon-purple" },
];

export const venues: Venue[] = [
  {
    id: "1",
    name: "The Electric Eel Lounge",
    vibeTags: ["Alive", "Energetic"],
    story: "Pulse-pounding beats and vibrant energy. Lose yourself in the rhythm.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29uY2VydCUyMG5pZ2h0Y2x1YnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-blue",
    textColorClass: "neon-text-blue",
  },
  {
    id: "2",
    name: "Velvet Kiss Speakeasy",
    vibeTags: ["Romantic", "Mysterious"],
    story: "Intimate corners and whispered secrets. Perfect for a night of connection.",
    image: "https://images.unsplash.com/photo-1529333166437-775054dd585D?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNwZWFrZWFzeSUyMGJhcnhlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-red",
    textColorClass: "neon-text-red",
  },
  {
    id: "3",
    name: "Zenith Rooftop Garden",
    vibeTags: ["Peaceful", "Chill"],
    story: "Breathtaking city views under a canopy of stars. Find your calm.",
    image: "https://images.unsplash.com/photo-1588000459939-2000075090e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vZnRvcCUyMGJhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-teal",
    textColorClass: "neon-text-teal",
  },
  {
    id: "4",
    name: "The Neon Arcade",
    vibeTags: ["Alive", "Energetic"],
    story: "Retro games and futuristic lights. A blast from the past, powered by now.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJjYWRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-pink",
    textColorClass: "neon-text-pink",
  },
  {
    id: "5",
    name: "Moonshadow Cafe",
    vibeTags: ["Peaceful", "Chill", "Romantic"],
    story: "Soft jazz, warm drinks, and quiet conversations. Your late-night haven.",
    image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhZmUlMjBhdCUyMG5pZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-lavender",
    textColorClass: "neon-text-lavender",
  },
  {
    id: "6",
    name: "Oracle's Den",
    vibeTags: ["Mysterious", "Chill"],
    story: "Uncover hidden gems and eclectic cocktails. What will you discover?",
    image: "https://images.unsplash.com/photo-1543007174-639a10a893e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFyayUyMGJhciUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    neonColorClass: "border-neon-purple",
    textColorClass: "neon-text-purple",
  },
];
