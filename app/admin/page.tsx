/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  slug: string;
  image: string;
  location: string;
  date: string;
  time: string;
  organizer_id: string | null;
  is_approved: boolean;
  created_at: string;
}

interface Booking {
  event_id: string;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);

    // Fetch users count
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Fetch events
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch bookings
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("event_id");

    if (eventsData) setEvents(eventsData);
    if (bookingsData) setBookings(bookingsData);

    // Calculate stats
    setStats({
      totalUsers: usersCount || 0,
      totalEvents: eventsData?.length || 0,
      pendingEvents: eventsData?.filter((e) => !e.is_approved).length || 0,
      approvedEvents: eventsData?.filter((e) => e.is_approved).length || 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getBookedCount = (eventId: string) => {
    return bookings.filter((b) => b.event_id === eventId).length;
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventToDelete.id);

    if (!error) {
      setEvents(events.filter((e) => e.id !== eventToDelete.id));
      setStats({
        ...stats,
        totalEvents: stats.totalEvents - 1,
        pendingEvents: eventToDelete.is_approved
          ? stats.pendingEvents
          : stats.pendingEvents - 1,
        approvedEvents: eventToDelete.is_approved
          ? stats.approvedEvents - 1
          : stats.approvedEvents,
      });
    }

    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = events.slice(startIndex, startIndex + eventsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white italic">
          Event Management
        </h1>
        <Link href="/events/create">
          <Button className="bg-primary-500 text-black hover:bg-primary-400 gap-2">
            <Plus className="w-4 h-4" />
            Add New Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-dark-200/50 border-dark-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="w-4 h-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-200/50 border-dark-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Events
            </CardTitle>
            <Calendar className="w-4 h-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalEvents}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-200/50 border-dark-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending Approval
            </CardTitle>
            <XCircle className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pendingEvents}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-200/50 border-dark-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Approved Events
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.approvedEvents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <div className="rounded-lg border border-dark-300 overflow-hidden bg-dark-200/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-dark-300 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">
                Events
              </TableHead>
              <TableHead className="text-gray-400 font-medium">
                Location
              </TableHead>
              <TableHead className="text-gray-400 font-medium">Date</TableHead>
              <TableHead className="text-gray-400 font-medium">Time</TableHead>
              <TableHead className="text-gray-400 font-medium">
                Booked spot
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-400 py-8"
                >
                  No events yet. Create your first event!
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-dark-300 hover:bg-dark-300/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                        {event.image && (
                          <Image
                            src={event.image}
                            alt={event.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-white font-medium">
                        {event.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {event.location}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(event.date)}
                  </TableCell>
                  <TableCell className="text-gray-300">{event.time}</TableCell>
                  <TableCell className="text-gray-300">
                    {getBookedCount(event.id)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/events/${event.slug}/edit`}>
                        <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setEventToDelete(event);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-dark-300 text-white hover:bg-dark-300"
          >
            Previous
          </Button>
          <span className="text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-dark-300 text-white hover:bg-dark-300"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-dark-200 border-dark-300">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete &quot;{eventToDelete?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-dark-300 text-white hover:bg-dark-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
