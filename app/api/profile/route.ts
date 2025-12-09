import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  } catch (error) {
    console.warn("Arcjet error:", error);
  }

  try {
    const body = await req.json();
    const { userId, full_name, avatar_url } = body;

    // 2. Security Check: Verify authenticated user
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
            // Internal API
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized operation" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name,
        avatar_url,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    // Update auth metadata (optional, but good for keeping sync)
    // Note: supabaseAdmin.auth.updateUserById(userId, ...) requires service role
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { full_name },
      }
    );

    if (authError) {
      console.error("Error updating auth metadata:", authError);
      // We don't necessarily fail the request if just auth metadata fails,
      // but it's good to know.
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        message: "Failed to update profile",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
