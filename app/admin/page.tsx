"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Shield,
  ArrowLeft,
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "organizer" | "attendee";
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  organizer_id: string | null;
  is_approved: boolean;
  created_at: string;
  date: string;
  organizer?: Profile;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch events with organizer info
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersData) setUsers(usersData);
    if (eventsData) setEvents(eventsData);

    // Calculate stats
    setStats({
      totalUsers: usersData?.length || 0,
      totalEvents: eventsData?.length || 0,
      pendingEvents: eventsData?.filter((e) => !e.is_approved).length || 0,
      approvedEvents: eventsData?.filter((e) => e.is_approved).length || 0,
    });

    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole as Profile["role"] } : u
        )
      );
      setIsUserDialogOpen(false);
    }
  };

  const updateEventApproval = async (eventId: string, isApproved: boolean) => {
    const { error } = await supabase
      .from("events")
      .update({ is_approved: isApproved })
      .eq("id", eventId);

    if (!error) {
      setEvents(
        events.map((e) =>
          e.id === eventId ? { ...e, is_approved: isApproved } : e
        )
      );
      setStats({
        ...stats,
        pendingEvents: isApproved
          ? stats.pendingEvents - 1
          : stats.pendingEvents + 1,
        approvedEvents: isApproved
          ? stats.approvedEvents + 1
          : stats.approvedEvents - 1,
      });
      setIsEventDialogOpen(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "organizer":
        return "default";
      default:
        return "secondary";
    }
  };

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
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Manage users, events, and platform settings
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-dark-200 border-dark-300">
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

        <Card className="bg-dark-200 border-dark-300">
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

        <Card className="bg-dark-200 border-dark-300">
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

        <Card className="bg-dark-200 border-dark-300">
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-dark-200 border border-dark-300">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary-500"
          >
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-primary-500"
          >
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary-500"
          >
            Pending ({stats.pendingEvents})
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-dark-300 hover:bg-dark-300">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-dark-300 hover:bg-dark-300"
                    >
                      <TableCell className="text-white font-medium">
                        {user.full_name || "—"}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserDialogOpen(true);
                          }}
                        >
                          Edit Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white">All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-dark-300 hover:bg-dark-300">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Created</TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      key={event.id}
                      className="border-dark-300 hover:bg-dark-300"
                    >
                      <TableCell className="text-white font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={event.is_approved ? "default" : "secondary"}
                        >
                          {event.is_approved ? "APPROVED" : "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(event.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/events/${event.slug}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEventDialogOpen(true);
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Events Tab */}
        <TabsContent value="pending">
          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {events.filter((e) => !e.is_approved).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No events pending approval
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-dark-300 hover:bg-dark-300">
                      <TableHead className="text-gray-400">Title</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events
                      .filter((e) => !e.is_approved)
                      .map((event) => (
                        <TableRow
                          key={event.id}
                          className="border-dark-300 hover:bg-dark-300"
                        >
                          <TableCell className="text-white font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(event.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                updateEventApproval(event.id, true)
                              }
                            >
                              Approve
                            </Button>
                            <Link href={`/events/${event.slug}`}>
                              <Button variant="outline" size="sm">
                                Preview
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Role Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-dark-200 border-dark-300">
          <DialogHeader>
            <DialogTitle className="text-white">Update User Role</DialogTitle>
            <DialogDescription className="text-gray-400">
              Change the role for{" "}
              {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              defaultValue={selectedUser?.role}
              onValueChange={(value) => {
                if (selectedUser) {
                  updateUserRole(selectedUser.id, value);
                }
              }}
            >
              <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-dark-300 border-dark-400">
                <SelectItem value="attendee">Attendee</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUserDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Management Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="bg-dark-200 border-dark-300">
          <DialogHeader>
            <DialogTitle className="text-white">Manage Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Status:</span>
              <Badge
                variant={selectedEvent?.is_approved ? "default" : "secondary"}
              >
                {selectedEvent?.is_approved ? "APPROVED" : "PENDING"}
              </Badge>
            </div>
          </div>
          <DialogFooter className="gap-2">
            {selectedEvent?.is_approved ? (
              <Button
                variant="destructive"
                onClick={() =>
                  selectedEvent && updateEventApproval(selectedEvent.id, false)
                }
              >
                Revoke Approval
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() =>
                  selectedEvent && updateEventApproval(selectedEvent.id, true)
                }
              >
                Approve Event
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsEventDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
