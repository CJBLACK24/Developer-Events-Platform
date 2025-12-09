import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import supabase from "@/lib/supabase";
import { generateSlug, normalizeDate, normalizeTime } from "@/lib/utils";

// Helper to map Supabase snake_case to frontend camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEvent = (event: any) => ({
  ...event,
  _id: event.id,
  createdAt: event.created_at,
  updatedAt: event.updated_at || event.created_at,
});

import { createClient } from "@supabase/supabase-js";

// Init Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

import aj from "@/lib/arcjet";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // 1. Arcjet Protection
  try {
    const decision = await aj.protect(req as unknown as Request, {
      requested: 1, // Consume 1 token
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    }
  } catch (error) {
    console.warn("Arcjet error:", error);
  }

  // 2. User Verification
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
          // Internal API, no need to set cookies
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let eventData: any = {};
    let imageUrl = "";
    let tags: string[] = [];
    let agenda: string[] = [];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      eventData = body;
      imageUrl = body.image;
      tags = body.tags || [];
      agenda = body.agenda || [];
    } else {
      const formData = await req.formData();

      try {
        // Extract basic fields
        for (const [key, value] of formData.entries()) {
          if (key !== "image" && key !== "tags" && key !== "agenda") {
            eventData[key] = value;
          }
        }
      } catch {
        return NextResponse.json(
          { message: "Invalid form data format" },
          { status: 400 }
        );
      }

      const file = formData.get("image") as File;

      if (!file)
        return NextResponse.json(
          { message: "Image file is required" },
          { status: 400 }
        );

      tags = JSON.parse(formData.get("tags") as string);
      agenda = JSON.parse(formData.get("agenda") as string);

      // Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "DevEvent" },
            (error, results) => {
              if (error) return reject(error);
              resolve(results);
            }
          )
          .end(buffer);
      });

      imageUrl = (uploadResult as { secure_url: string }).secure_url;
    }

    // Prepare data for Supabase
    const slug = generateSlug(eventData.title);

    // Check for unique slug
    const { data: existingSlug } = await supabaseAdmin
      .from("events")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingSlug) {
      return NextResponse.json(
        { message: "An event with this title already exists." },
        { status: 409 }
      );
    }

    const formattedDate = normalizeDate(eventData.date);
    const formattedTime = normalizeTime(eventData.time);

    const newEventPayload = {
      title: eventData.title,
      slug: slug,
      description: eventData.description,
      overview: eventData.overview,
      image: imageUrl,
      venue: eventData.venue,
      location: eventData.location,
      date: formattedDate,
      time: formattedTime,
      mode: eventData.mode,
      audience: eventData.audience,
      agenda: agenda,
      organizer: eventData.organizer,
      tags: tags,
      organizer_id: user.id, // Enforce authenticated user ID
      is_approved: eventData.is_approved ?? true,
    };

    const { data: insertedEvent, error } = await supabaseAdmin
      .from("events")
      .insert([newEventPayload])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Event created successfully", event: mapEvent(insertedEvent) },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events: events.map(mapEvent),
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
