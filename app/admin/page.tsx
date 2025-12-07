/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { SuccessDialog } from "@/components/ui/success-dialog";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";

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
  booked_count: number;
}

interface Stats {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
}

interface ApiResponse {
  events: Event[];
  stats: Stats;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 10;

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/events?page=${page}&limit=${eventsPerPage}`
      );
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setEvents(data.events);
        setStats(data.stats);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/events/${eventToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refetch current page data
        fetchData(currentPage);
        setDeleteDialogOpen(false);
        setEventToDelete(null);
        setShowDeleteSuccess(true);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    setDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // Parse the time and format it nicely
    if (!timeString) return "";

    // If time contains a range (e.g., "12:25 - 14:40"), format both parts
    if (timeString.includes("-")) {
      const [start, end] = timeString.split("-").map((t) => t.trim());
      return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
    }

    return formatSingleTime(timeString);
  };

  const formatSingleTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  if (loading && events.length === 0) {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Event Management
        </h1>
        <Link href="/events/create">
          <Button className="bg-[#59DECA] text-black hover:bg-[#4ac9b9] font-semibold px-6 py-2 rounded-lg">
            Add New Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#182830] border-[#182830] rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="w-8 h-8 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#182830] border-[#182830] rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Events
            </CardTitle>
            <Calendar className="w-8 h-8 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalEvents}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#182830] border-[#182830] rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending Approval
            </CardTitle>
            <XCircle className="w-8 h-8 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pendingEvents}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#182830] border-[#182830] rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Approved Events
            </CardTitle>
            <CheckCircle className="w-8 h-8 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.approvedEvents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <div className="rounded-xl overflow-hidden bg-[#0c151a] border border-[#182830]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#182830] hover:bg-transparent bg-[#182830]">
              <TableHead className="text-gray-400 font-medium text-sm py-4 border-r border-[#182830] text-center">
                Events
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm border-r border-[#182830] text-center">
                Location
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm border-r border-[#182830] text-center">
                Date
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm border-r border-[#182830] text-center">
                Time
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm border-r border-[#182830] text-center">
                Booked spot
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-sm text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-400 py-8"
                >
                  No events yet. Create your first event!
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-b border-[#182830] hover:bg-[#0c151a] bg-[#0c151a]"
                >
                  <TableCell className="py-4 border-r border-[#182830]">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-dark-300 shrink-0">
                        {event.image && (
                          <Image
                            src={event.image}
                            alt={event.title}
                            width={56}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-white font-medium">
                        {event.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 border-r border-[#182830] text-center">
                    {event.location}
                  </TableCell>
                  <TableCell className="text-gray-300 border-r border-[#182830] text-center">
                    {formatDate(event.date)}
                  </TableCell>
                  <TableCell className="text-gray-300 border-r border-[#182830] text-center">
                    {formatTime(event.time)}
                  </TableCell>
                  <TableCell className="text-gray-300 border-r border-[#182830] text-center">
                    {event.booked_count}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-4">
                      <Link href={`/events/${event.slug}/edit`}>
                        <button className="text-[#59DECA] hover:text-[#4ac9b9] text-sm font-medium">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setEventToDelete(event);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-white hover:text-gray-300 text-sm font-medium"
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
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="border-[#182830] bg-[#0c151a] text-white hover:bg-[#132029] px-6 rounded-lg"
          >
            Previous
          </Button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="border-[#182830] bg-[#0c151a] text-white hover:bg-[#132029] px-6 rounded-lg"
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
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Success Dialog */}
      <SuccessDialog
        open={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Event Deleted!"
        message="The event has been successfully removed."
        buttonText="Continue"
      />
    </div>
  );
}
