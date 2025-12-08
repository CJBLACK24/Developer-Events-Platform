"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await createBooking({ eventId, slug, email, name });

      if (result && result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage("Failed to book spot. Please try again.");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="book-event" className="mt-4">
      {submitted ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center">
          <p className="font-medium">Thank you for signing up!</p>
          <p className="text-sm opacity-80 mt-1">
            We&apos;ll verify your spot shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#59DECA] transition-colors mb-2"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address to book"
              className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#59DECA] transition-colors"
              disabled={loading}
            />
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !name}
            className="w-full py-2 px-4 bg-[#59DECA] hover:bg-[#4ac9b9] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? "Booking..." : "Book your spot"}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
