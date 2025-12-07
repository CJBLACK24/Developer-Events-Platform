"use server";

import supabase from "@/lib/supabase";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    console.log(
      `Booking submission started for event: ${slug}, user: ${email}`
    );

    // In Supabase schema, event_id expects a number (BIGINT).
    // Mongoose used strings (ObjectIds).
    // The previous refactor mapped `id` (bigint) to `_id` (string) for frontend compatibility.
    // If eventId comes from frontend as a string, we might need to parse it if it looks like a number,
    // or checks if we kept ObjectIds. Since we are moving to Supabase, IDs are likely BIGINTs now.
    // The Supabase 'events' table uses BIGINT id.

    // Ensure we send the correct ID type.
    const numericEventId = parseInt(eventId, 10);

    const { error } = await supabase.from("bookings").insert({
      event_id: isNaN(numericEventId) ? null : numericEventId,
      email,
    });

    if (error) {
      console.error("Booking creation validation/insert failed:", error);
      throw new Error(error.message);
    }

    console.log("Booking created successfully in Supabase");
    return { success: true };
  } catch (e) {
    console.error("create booking failed", e);
    return { success: false };
  }
};
