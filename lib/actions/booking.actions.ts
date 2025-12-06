"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";
import { captureServerEvent, identifyServerUser } from "@/lib/posthog";

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
    await connectDB();

    await Booking.create({ eventId, slug, email });

    // Server-side PostHog tracking
    // Identify the user by their email
    identifyServerUser(email, {
      email: email,
      first_booking_event: slug,
    });

    // Capture the booking event on the server
    captureServerEvent(email, "booking_created", {
      event_id: eventId,
      event_slug: slug,
      booking_source: "web",
    });

    return { success: true };
  } catch (e) {
    console.error("create booking failed", e);

    // Capture the error event
    captureServerEvent(email, "booking_failed", {
      event_id: eventId,
      event_slug: slug,
      error: e instanceof Error ? e.message : "Unknown error",
    });

    return { success: false };
  }
};
