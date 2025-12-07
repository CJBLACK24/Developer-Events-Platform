import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Server-side Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Fetch all data in parallel for better performance
    const [eventsResult, usersResult, allEventsResult] = await Promise.all([
      // Fetch events with pagination
      supabaseAdmin
        .from("events")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1),
      // Fetch users count
      supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true }),
      // Fetch all events for stats (just is_approved field)
      supabaseAdmin.from("events").select("is_approved"),
    ]);

    const { data: events, error: eventsError, count } = eventsResult;
    const { count: usersCount } = usersResult;
    const { data: allEvents } = allEventsResult;

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    // Calculate stats
    const stats = {
      totalUsers: usersCount || 0,
      totalEvents: allEvents?.length || 0,
      pendingEvents: allEvents?.filter((e) => !e.is_approved).length || 0,
      approvedEvents: allEvents?.filter((e) => e.is_approved).length || 0,
    };

    // Fetch booking counts for these events
    const eventIds = events?.map((e) => e.id) || [];

    let bookingCounts: Record<string, number> = {};

    if (eventIds.length > 0) {
      const { data: bookings, error: bookingsError } = await supabaseAdmin
        .from("bookings")
        .select("event_id")
        .in("event_id", eventIds);

      if (!bookingsError && bookings) {
        bookingCounts = bookings.reduce((acc, booking) => {
          acc[booking.event_id] = (acc[booking.event_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      }
    }

    // Attach booking count to each event
    const eventsWithBookings = events?.map((event) => ({
      ...event,
      booked_count: bookingCounts[event.id] || 0,
    }));

    return NextResponse.json({
      events: eventsWithBookings,
      stats,
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Admin events API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
