import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

// Server-side Supabase client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to verify admin role
async function verifyAdminRole(): Promise<{
  isAdmin: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // Not needed for read-only auth check
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isAdmin: false, error: "Unauthorized: Not authenticated" };
    }

    // Check user role
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { isAdmin: false, error: "Forbidden: Admin access required" };
    }

    return { isAdmin: true };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { isAdmin: false, error: "Authentication error" };
  }
}

export async function GET(request: NextRequest) {
  // Verify admin role
  const { isAdmin, error } = await verifyAdminRole();
  if (!isAdmin) {
    return NextResponse.json(
      { error: error || "Unauthorized" },
      { status: error?.includes("Forbidden") ? 403 : 401 }
    );
  }

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
