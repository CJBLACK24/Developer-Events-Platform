import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/settings", "/events/create"];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that require organizer or admin role
const organizerRoutes = ["/events/create"];

export async function middleware(request: NextRequest) {
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make your app slow
  // because it will unnecessarily block the rendering.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

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
    // Fetch user profile to check role
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
