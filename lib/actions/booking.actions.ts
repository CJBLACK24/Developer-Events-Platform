"use server";

import { createClient } from "@supabase/supabase-js";
import { generateTicketCode } from "@/lib/tickets";
import { revalidatePath } from "next/cache";

// Initialize Supabase Admin strictly for server actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

interface CreateBookingParams {
  eventId: string;
  slug: string;
  email: string;
  name: string;
  metadata?: Record<string, unknown>;
}

export const createBooking = async ({
  eventId,
  slug,
  email,
  name,
  metadata,
}: CreateBookingParams) => {
  try {
    console.log(`[Booking] Starting for event: ${slug}, user: ${email}`);

    const numericEventId = parseInt(eventId, 10);
    if (isNaN(numericEventId)) {
      return { success: false, error: "Invalid event ID" };
    }

    // 1. Fetch Event Capacity
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from("events")
      .select("capacity, title, location, date, time")
      .eq("id", numericEventId)
      .single();

    if (eventError || !eventData) {
      return { success: false, error: "Event not found" };
    }

    // Check count
    const { count: currentBookings, error: countError } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("event_id", numericEventId);

    if (countError) {
      return { success: false, error: "System error checking capacity" };
    }

    // Capacity Check
    if (eventData.capacity && (currentBookings || 0) >= eventData.capacity) {
      return { success: false, error: "Event is fully booked!" };
    }

    // 2. Check for duplicate booking
    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("event_id", numericEventId)
      .eq("email", email)
      .single();

    if (existing) {
      return { success: false, error: "You have already booked this event." };
    }

    // 3. Generate Ticket
    const ticketCode = generateTicketCode();

    // 4. Insert Booking
    const { error: insertError } = await supabaseAdmin.from("bookings").insert({
      event_id: numericEventId,
      email,
      ticket_code: ticketCode,
      status: "confirmed",
      metadata: {
        name,
        ...metadata,
      },
    });

    if (insertError) {
      console.error("Booking insert failed:", insertError);
      return { success: false, error: "Failed to confirm booking." };
    }

    console.log(`[Booking] Success! Code: ${ticketCode}`);

    revalidatePath(`/events/${slug}`);
    revalidatePath("/admin");

    return {
      success: true,
      ticket: {
        ticketCode,
        eventName: eventData.title,
        attendeeName: name,
        date: new Date(eventData.date).toLocaleDateString(),
        location: eventData.location,
      },
    };
  } catch (e) {
    console.error("create booking failed", e);
    return { success: false, error: "Internal server error" };
  }
};

export const getUserBookings = async (email: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*, events(title, date, location, time, image)")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching bookings:", error);
    return [];
  }
};
