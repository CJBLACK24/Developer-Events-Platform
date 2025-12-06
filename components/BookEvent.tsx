"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import { usePostHog } from "@/components/providers/PostHogProvider";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const posthog = usePostHog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Identify the user with their email before capturing the event
    posthog.identify(email, {
      email: email,
    });

    const { success } = await createBooking({ eventId, slug, email });

    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", {
        event_id: eventId,
        event_slug: slug,
        booking_email: email,
      });
    } else {
      console.error("Booking creation failed");
      posthog.capture("booking_error", {
        event_id: eventId,
        event_slug: slug,
        error_type: "creation_failed",
      });
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
