"use server";

import supabase from "@/lib/supabase";

// Helper to map Supabase snake_case to frontend camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEvent = (event: any) => ({
  ...event,
  _id: event.id, // Map Supabase ID to _id for frontend compatibility
  createdAt: event.created_at,
  updatedAt: event.updated_at || event.created_at,
});

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    // 1. Get the current event to find its tags
    const { data: currentEvent } = await supabase
      .from("events")
      .select("tags, id")
      .eq("slug", slug)
      .single();

    if (!currentEvent) return [];

    // 2. Find events with overlapping tags, excluding the current event
    const { data: similarEvents, error } = await supabase
      .from("events")
      .select("*")
      .overlaps("tags", currentEvent.tags || [])
      .neq("id", currentEvent.id)
      .limit(3);

    if (error) {
      console.error("Error fetching similar events:", error);
      return [];
    }

    return similarEvents.map(mapEvent);
  } catch (error) {
    console.error("Unexpected error in getSimilarEventsBySlug:", error);
    return [];
  }
};

export const getAllEvents = async () => {
  try {
    console.log("Fetching events from Supabase...");

    // Fetch all events sorted by creation date
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getAllEvents:", error);
      return [];
    }

    console.log(`Events fetched: ${events.length}`);
    return events.map(mapEvent);
  } catch (e) {
    console.error("Error in getAllEvents:", e);
    return [];
  }
};

export const getEventBySlug = async (slug: string) => {
  try {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Error fetching event by slug ${slug}:`, error);
      return null;
    }

    return mapEvent(event);
  } catch (e) {
    console.error(e);
    return null;
  }
};
