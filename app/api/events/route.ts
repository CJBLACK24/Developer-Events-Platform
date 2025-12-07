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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventData: any = {};

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

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

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

    // Prepare data for Supabase
    const slug = generateSlug(eventData.title);

    // Check for unique slug
    const { data: existingSlug } = await supabase
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
      image: (uploadResult as { secure_url: string }).secure_url,
      venue: eventData.venue,
      location: eventData.location,
      date: formattedDate,
      time: formattedTime,
      mode: eventData.mode,
      audience: eventData.audience,
      agenda: agenda,
      organizer: eventData.organizer,
      tags: tags,
    };

    const { data: insertedEvent, error } = await supabase
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
