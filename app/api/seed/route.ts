import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { sampleEvents } from "@/lib/sampleEvents";

export async function POST() {
  try {
    // Check if events already exist
    const { count, error: countError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    if (count && count > 0) {
      return NextResponse.json(
        {
          message: `Database already has ${count} events. Clear them first if you want to reseed.`,
          count: count,
        },
        { status: 200 }
      );
    }

    // Insert sample events
    const { data, error } = await supabase
      .from("events")
      .insert(sampleEvents)
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message: `Successfully seeded ${data?.length || 0} events!`,
        count: data?.length || 0,
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
    const { error } = await supabase.from("events").delete().neq("id", 0); // Delete all rows

    if (error) throw error;

    return NextResponse.json(
      {
        message: "All events deleted",
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
