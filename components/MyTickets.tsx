"use client";

import { useEffect, useState } from "react";
import { getUserBookings } from "@/lib/actions/booking.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import TicketDisplay from "./TicketDisplay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function MyTickets({ email }: { email: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!email) return;
      const data = await getUserBookings(email);
      setBookings(data);
      setLoading(false);
    };
    fetchTickets();
  }, [email]);

  if (loading)
    return (
      <div className="text-center text-zinc-500 py-10">Loading tickets...</div>
    );

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/50">
        <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-zinc-300">No tickets found</h3>
        <p className="text-zinc-500 mt-1 mb-6">
          You haven't booked any events yet.
        </p>
        <Link
          href="/#featured-events"
          className="inline-flex items-center justify-center rounded-lg bg-[#59DECA] px-4 py-2 text-sm font-medium text-black hover:bg-[#4ac9b9] transition-colors"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-medium line-clamp-1">
              {booking.events?.title || "Unknown Event"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-zinc-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#59DECA]" />
                <span>
                  {booking.events?.date
                    ? new Date(booking.events.date).toLocaleDateString()
                    : "TBA"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#59DECA]" />
                <span>{booking.events?.time || "TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#59DECA]" />
                <span className="truncate">
                  {booking.events?.location || "Online"}
                </span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                  View Ticket
                </button>
              </DialogTrigger>
              <DialogContent className="bg-dark-200 border-dark-200 max-w-lg">
                <TicketDisplay
                  ticket={{
                    ticketCode: booking.ticket_code || "N/A",
                    eventName: booking.events?.title,
                    attendeeName: booking.metadata?.name || "Attendee",
                    date: booking.events?.date,
                    location: booking.events?.location,
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
