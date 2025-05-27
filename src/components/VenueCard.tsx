
import React from 'react';
import { Venue } from '@/data/venues';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom'; // Optional: if you want to redirect to login

interface VenueCardProps {
  venue: Venue;
  index: number;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, index }) => {
  const { user } = useAuth();
  // const navigate = useNavigate(); // Optional

  const handleCardClick = async () => {
    if (venue.id.startsWith('event-') && user) {
      const eventId = venue.id.replace('event-', '');
      console.log(`Event card clicked: ${venue.name}, Event ID: ${eventId}, User ID: ${user.id}`);
      try {
        const { error } = await supabase.from('event_clicks').insert([
          { user_id: user.id, event_id: eventId }
        ]);
        if (error) {
          if (error.code === '23505') { // PostgreSQL unique_violation code
            toast.info(`You've already shown interest in "${venue.name}".`);
          } else {
            toast.error(`Failed to save preference: ${error.message}`);
            console.error('Error logging event click:', error);
          }
        } else {
          toast.success(`Preference for "${venue.name}" saved!`);
        }
      } catch (err) {
        toast.error('An unexpected error occurred while saving preference.');
        console.error('Unexpected error logging event click:', err);
      }
    } else if (venue.id.startsWith('event-') && !user) {
      toast.info('Login to save your event preferences!');
      // navigate('/auth'); // Optional: redirect to login page
    } else {
      console.log(`Venue card clicked: ${venue.name} (not an event or no user)`);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "glassmorphism-card w-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in-up",
        venue.id.startsWith('event-') ? 'cursor-pointer' : '', // Add cursor-pointer only for events
        venue.neonColorClass,
        `hover:${venue.neonColorClass.replace('border-', 'shadow-')}`
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <img className="w-full h-48 object-cover" src={venue.image} alt={venue.name} />
      <CardHeader>
        <CardTitle className={cn("text-2xl font-bold", venue.textColorClass)}>{venue.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-base">{venue.story}</CardDescription>
        <div className="mt-4">
          {venue.vibeTags.map(tag => (
            <span 
              key={tag} 
              className={cn(
                "inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 text-white",
                venue.neonColorClass.replace('border-', 'bg-'),
                "bg-opacity-30",
                "transition-all duration-200 ease-in-out hover:scale-105 hover:bg-opacity-60" 
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
