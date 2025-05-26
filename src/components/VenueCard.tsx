
import React from 'react';
import { Venue } from '@/data/venues';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VenueCardProps {
  venue: Venue;
  index: number;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, index }) => {
  return (
    <Card 
      className={cn(
        "glassmorphism-card w-full max-w-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-fade-in-up",
        venue.neonColorClass, // Applies border color
        `hover:${venue.neonColorClass.replace('border-', 'shadow-')}` // Applies shadow on hover
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <img className="w-full h-48 object-cover" src={venue.image} alt={venue.name} />
      <CardHeader>
        <CardTitle className={cn("text-2xl font-bold", venue.textColorClass)}>{venue.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300 text-base">{venue.story}</CardDescription>
        <div className="mt-4">
          {venue.vibeTags.map(tag => (
            <span 
              key={tag} 
              className={cn(
                "inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 text-white",
                // Example: if venue.neonColorClass is 'border-neon-blue', this becomes 'bg-neon-blue/30'
                // Using Tailwind arbitrary value for background color with opacity
                `${venue.neonColorClass.replace('border-', 'bg-')}/30` 
              )}
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
