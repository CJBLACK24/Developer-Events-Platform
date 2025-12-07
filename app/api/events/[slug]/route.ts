import { NextRequest, NextResponse } from "next/server";

import supabase from "@/lib/supabase";

// Helper to map Supabase snake_case to frontend camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEvent = (event: any) => ({
  ...event,
  _id: event.id,
  createdAt: event.created_at,
  updatedAt: event.updated_at || event.created_at,
});

// Define route params type for type safety
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single events by its slug
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await and extract slug from params
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query events by slug
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", sanitizedSlug)
      .single();

    if (error) {
      // Handle events not found (Supabase returns error for .single() if not found)
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return successful response with events data
    return NextResponse.json(
      { message: "Event fetched successfully", event: mapEvent(event) },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching events by slug:", error);
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
