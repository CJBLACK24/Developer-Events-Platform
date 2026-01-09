import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import aj from "./lib/arcjet";

export async function proxy(request: NextRequest) {
  // Clear way to protect all routes with Arcjet
  const decision = await aj.protect(request, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (decision.reason.isBot()) {
      return NextResponse.json({ error: "Bot detected" }, { status: 403 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Routes configuration moved inside for clarity or could be imported
  const protectedRoutes = ["/settings", "/events/create"];
  const adminRoutes = ["/admin"];
  const organizerRoutes = ["/events/create"];

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isOrganizerRoute = organizerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If no user and trying to access protected route, redirect to sign-in
  if (!user && (isProtectedRoute || isAdminRoute || isOrganizerRoute)) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user exists but trying to access admin/organizer routes, check role
  if (user && (isAdminRoute || isOrganizerRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role || "attendee";

    // Admin route check
    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Organizer route check (allows admin or organizer)
    if (isOrganizerRoute && userRole !== "admin" && userRole !== "organizer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (we handle these separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
