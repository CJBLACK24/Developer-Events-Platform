"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { User, Settings, LogOut, Shield, Plus } from "lucide-react";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const isOrganizer =
    profile?.role === "organizer" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  const getInitials = (
    name: string | null | undefined,
    email: string | undefined
  ) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "organizer":
        return "bg-primary-500/20 text-primary-400 border-primary-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-100/80 backdrop-blur-md border-b border-dark-200">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.png" alt="logo" width={28} height={28} />
          <span className="text-lg font-bold text-white hidden sm:block">
            DevEvent
          </span>
        </Link>

        {/* Navigation - Center */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#featured-events"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          {isOrganizer && (
            <Link
              href="/events/create"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Event</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
        </div>

        {/* User Menu - Right */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-100 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-dark-200 hover:border-primary-500 transition-colors">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.full_name || ""}
                    />
                    <AvatarFallback className="bg-dark-200 text-white text-sm">
                      {getInitials(profile?.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-dark-200 border-dark-200 text-white"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                    <Badge
                      variant="outline"
                      className={`w-fit text-xs uppercase ${getRoleBadgeColor(
                        profile?.role || "attendee"
                      )}`}
                    >
                      {profile?.role || "Attendee"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-dark-100" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-dark-100"
                >
                  <Link href="/settings" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-dark-100"
                >
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-dark-100" />
                <DropdownMenuItem
                  onSelect={() => signOut()}
                  className="cursor-pointer hover:bg-dark-100 text-red-400 focus:text-red-400 focus:bg-dark-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-white text-black hover:bg-zinc-200"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
