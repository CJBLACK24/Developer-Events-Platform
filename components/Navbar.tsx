"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const isOrganizer =
    profile?.role === "organizer" || profile?.role === "admin";

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        <ul className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/#featured-events">Events</Link>

          {isOrganizer && <Link href="/events/create">Create Event</Link>}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden md:block">
                {profile?.role ? `${profile.role.toUpperCase()}` : "GUEST"}
              </span>
              <button
                onClick={signOut}
                className="text-sm border border-dark-300 px-4 py-2 rounded-lg hover:bg-dark-200 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-500 text-dark-100 px-4 py-2 rounded-lg font-bold hover:bg-primary-600 transition-all"
            >
              Sign In
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
