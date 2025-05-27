import { useState, useMemo } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venue, Vibe } from '@/data/venues';
import { BusynessLevel } from '@/data/moodVisuals';

// Interface for External Events based on the Supabase table
export interface ExternalEvent {
  id: string;
  event_title: string;
  event_description: string | null;
  event_type: string;
  start_datetime: string;
  end_datetime: string | null;
  venue_name: string | null;
  venue_address: string | null;
  lat: number | null;
  lng: number | null;
  source_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const fetchVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      id,
      name,
      vibeTags:vibe_tags,
      story,
      image,
      neonColorClass:neon_color_class,
      textColorClass:text_color_class,
      lat,
      lng,
      created_at,
      updated_at
    `);

  if (error) {
    console.error('Error fetching venues:', error);
    throw new Error(error.message);
  }
  return data?.map(venue => ({ 
    ...venue, 
    vibeTags: (venue.vibeTags || []).map(tag => tag as Vibe)
  })) || [];
};

const fetchExternalEvents = async (): Promise<ExternalEvent[]> => {
  const { data, error } = await supabase
    .from('external_events')
    .select(`
      id,
      event_title,
      event_description,
      event_type,
      start_datetime,
      end_datetime,
      venue_name,
      venue_address,
      lat,
      lng,
      source_url,
      image_url,
      created_at, 
      updated_at 
    `)
    .gte('start_datetime', new Date().toISOString().split('T')[0] + 'T00:00:00.000Z') 
    .order('start_datetime', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Error fetching external events:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const busynessLevels: BusynessLevel[] = ["empty", "light", "medium", "busy", "on_fire"];
const getRandomBusyness = (): BusynessLevel => busynessLevels[Math.floor(Math.random() * busynessLevels.length)];

export const useIndexPageData = (selectedMood: Vibe | null) => {
  const allVenuesQuery = useQuery<Venue[], Error>({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  });

  const externalEventsQuery = useQuery<ExternalEvent[], Error>({
    queryKey: ['external_events'],
    queryFn: fetchExternalEvents,
  });

  const filteredVenues = useMemo(() => {
    if (!allVenuesQuery.data) {
      return [];
    }
    const venuesWithBusyness = allVenuesQuery.data.map(venue => ({
      ...venue,
      busyness: venue.busyness || getRandomBusyness(),
    }));
    if (!selectedMood) {
      return venuesWithBusyness.slice(0, 9); 
    }
    return venuesWithBusyness.filter(venue => venue.vibeTags.includes(selectedMood));
  }, [selectedMood, allVenuesQuery.data]);

  const upcomingEvents = useMemo(() => {
    if (!externalEventsQuery.data) {
      return [];
    }
    return externalEventsQuery.data.map(ev => {
      let demoVibeTags: Vibe[] = [];
      if (ev.event_type?.toLowerCase().includes('music') || ev.event_type?.toLowerCase().includes('concert')) demoVibeTags.push('Energetic');
      else if (ev.event_type?.toLowerCase().includes('art') || ev.event_type?.toLowerCase().includes('exhibit')) demoVibeTags.push('Intellectual');
      else if (ev.event_type?.toLowerCase().includes('market') || ev.event_type?.toLowerCase().includes('festival')) demoVibeTags.push('Alive');
      else demoVibeTags.push('Chill');

      // Format start and end times for better display
      const startTime = new Date(ev.start_datetime).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
      const endTime = ev.end_datetime ? new Date(ev.end_datetime).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'}) : null;
      let eventTiming = `Starts: ${startTime}`;
      if (endTime) eventTiming += ` - Ends: ${endTime}`;


      return {
        id: `event-${ev.id}`, // Prefix to identify as event
        name: ev.event_title,
        lat: ev.lat ?? 0, // Provide default if null, though VenueCard doesn't use it
        lng: ev.lng ?? 0, // Provide default if null
        vibeTags: demoVibeTags,
        story: `${ev.event_type}. ${eventTiming}. ${ev.venue_name ? `At: ${ev.venue_name}. ` : ''}${ev.event_description || ''}`,
        image: ev.image_url || '/placeholder.svg', // Ensure placeholder
        neonColorClass: 'neon-border-yellow-500', 
        textColorClass: 'text-neon-yellow',
        created_at: ev.created_at,
        updated_at: ev.updated_at,
        busyness: getRandomBusyness(), // Add busyness for consistency if VenueCard uses it
      } as Venue; // Assert as Venue, ensure all required Venue props are present
    }).slice(0, 6); // Limit to 6 events for the grid for now
  }, [externalEventsQuery.data]);

  const venuesForMap = useMemo(() => {
    const baseVenues: Venue[] = [];
    if (allVenuesQuery.data) {
      const venuesToConsider = filteredVenues.length > 0 && selectedMood ? filteredVenues : allVenuesQuery.data;
      baseVenues.push(...(venuesToConsider.slice(0, selectedMood ? venuesToConsider.length : 5).map(venue => ({
        ...venue,
        busyness: venue.busyness || getRandomBusyness(),
      }))));
    }

    const mappedEvents: Venue[] = [];
    if (externalEventsQuery.data) {
      externalEventsQuery.data.forEach(ev => {
        if (ev.lat != null && ev.lng != null) {
          // Assign a Vibe based on event_type for icon demonstration
          let demoVibeTags: Vibe[] = [];
          if (ev.event_type?.toLowerCase().includes('music') || ev.event_type?.toLowerCase().includes('concert')) demoVibeTags.push('Energetic');
          else if (ev.event_type?.toLowerCase().includes('art') || ev.event_type?.toLowerCase().includes('exhibit')) demoVibeTags.push('Intellectual');
          else if (ev.event_type?.toLowerCase().includes('market') || ev.event_type?.toLowerCase().includes('festival')) demoVibeTags.push('Alive');
          else demoVibeTags.push('Chill');

          mappedEvents.push({
            id: `event-${ev.id}`,
            name: ev.event_title,
            lat: ev.lat,
            lng: ev.lng,
            vibeTags: demoVibeTags,
            story: `Event Type: ${ev.event_type}. ${ev.event_description || ''}. Starts: ${new Date(ev.start_datetime).toLocaleString()}. ${ev.venue_name ? 'At: ' + ev.venue_name : ''}`,
            image: ev.image_url || '/placeholder.svg',
            neonColorClass: 'neon-border-yellow-500', 
            textColorClass: 'text-neon-yellow',
            created_at: ev.created_at,
            updated_at: ev.updated_at,
            busyness: getRandomBusyness(),
          });
        }
      });
    }
    return [...baseVenues, ...mappedEvents];
  }, [filteredVenues, allVenuesQuery.data, externalEventsQuery.data, selectedMood]);

  return {
    allVenuesQuery,
    externalEventsQuery, // Expose this for VenueGrid to check loading/error states for events
    filteredVenues,
    upcomingEvents, // Add this
    venuesForMap,
  };
};
