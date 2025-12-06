import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { sampleEvents } from "@/lib/sampleEvents";

export async function POST() {
  try {
    await connectDB();

    // Check if events already exist
    const existingCount = await Event.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json(
        {
          message: `Database already has ${existingCount} events. Clear them first if you want to reseed.`,
          count: existingCount,
        },
        { status: 200 }
      );
    }

    // Insert sample events
    const result = await Event.insertMany(sampleEvents);

    return NextResponse.json(
      {
        message: `Successfully seeded ${result.length} events!`,
        count: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();

    const result = await Event.deleteMany({});

    return NextResponse.json(
      {
        message: `Deleted ${result.deletedCount} events`,
        count: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete events",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
