/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "@/lib/actions/booking.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import TicketDisplay from "./TicketDisplay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyTickets({ email }: { email: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!email) return;
      const data = await getUserBookings(email);
      setBookings(data);
      setLoading(false);
    };
    fetchTickets();
  }, [email]);

  const refreshTickets = async () => {
    const data = await getUserBookings(email);
    setBookings(data);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const result = await cancelBooking(bookingId, email);
      if (result.success) {
        // Refresh bookings
        await refreshTickets();
      } else {
        alert(result.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("An error occurred while cancelling");
    } finally {
      setCancellingId(null);
    }
  };

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
          You haven&apos;t booked any events yet.
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

  // Separate active and cancelled bookings
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Active Tickets */}
      {activeBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-400">Active Tickets</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeBookings.map((booking) => (
              <Card
                key={booking.id}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-base font-medium line-clamp-1 flex-1">
                      {booking.events?.title || "Unknown Event"}
                    </CardTitle>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      Confirmed
                    </Badge>
                  </div>
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

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors border border-zinc-700">
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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Cancel Booking
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to cancel your booking for{" "}
                            <span className="text-white font-medium">
                              {booking.events?.title}
                            </span>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
                            Keep Booking
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Tickets */}
      {cancelledBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-400">
            Cancelled Tickets
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {cancelledBookings.map((booking) => (
              <Card
                key={booking.id}
                className="bg-zinc-900/50 border-zinc-800/50 opacity-60"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-zinc-400 text-base font-medium line-clamp-1 flex-1 line-through">
                      {booking.events?.title || "Unknown Event"}
                    </CardTitle>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      Cancelled
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {booking.events?.date
                          ? new Date(booking.events.date).toLocaleDateString()
                          : "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">
                        {booking.events?.location || "Online"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
