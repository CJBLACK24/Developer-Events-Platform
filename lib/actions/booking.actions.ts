"use server";

import { createClient } from "@supabase/supabase-js";

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

    // Ensure we send the correct ID type.
    const numericEventId = parseInt(eventId, 10);

    if (isNaN(numericEventId)) {
      console.error("Invalid event ID:", eventId);
      return { success: false, error: "Invalid event ID" };
    }

    // Use Service Role to bypass RLS
    const { error } = await supabaseAdmin.from("bookings").insert({
      event_id: numericEventId,
      email,
    });

    if (error) {
      console.error("Booking creation validation/insert failed:", error);
      // Check for duplicate key error (code 23505 in Postgres)
      if (error.code === "23505") {
        // Ideally check constraint name, but generic message is okay
        // Assuming unique constraint on (event_id, email)
        console.log("Duplicate booking attempt");
        // Treat as success to avoid leaking/confusing user, OR return specific error
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    console.log("Booking created successfully in Supabase");
    return { success: true };
  } catch (e) {
    console.error("create booking failed", e);
    return { success: false, error: "Internal server error" };
  }
};
