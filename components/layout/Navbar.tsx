"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  User,
  Settings,
  LogOut,
  Shield,
  Plus,
  Menu,
  X,
  Home,
  Calendar,
} from "lucide-react";

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/50 backdrop-blur-[20px] border-b border-[#151024]">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-20 h-[80px] flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/logo.png" alt="logo" width={28} height={28} />
            {/* Desktop Brand */}
            <span className="text-xl font-bold text-white hidden sm:block">
              <span className="italic">Dev</span>
              <span className="text-[#59DECA]">Event</span>
            </span>
          </Link>

          {/* Navigation - Center (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-base font-medium text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#featured-events"
              className="text-base font-medium text-gray-300 hover:text-white transition-colors"
            >
              Events
            </Link>
            {isOrganizer && (
              <Link
                href="/events/create"
                className="text-base font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-base font-medium text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0D161A] border-r border-[#182830] z-50 lg:hidden flex flex-col"
            >
              {/* Sidebar Header with Logo */}
              <div className="p-4 border-b border-[#182830] flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <span className="text-xl font-bold text-white">
                    <span className="italic">Dev</span>
                    <span className="text-[#59DECA]">Event</span>
                  </span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  href="/#featured-events"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Events</span>
                </Link>
                {isOrganizer && (
                  <Link
                    href="/events/create"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Create Event</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-[#59DECA] hover:bg-[#59DECA]/10 rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}
              </nav>

              {/* Bottom Section - User Profile */}
              <div className="p-4 border-t border-[#182830]">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/settings"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Avatar className="h-10 w-10 border-2 border-[#59DECA]">
                        <AvatarImage
                          src={profile?.avatar_url}
                          alt={profile?.full_name || ""}
                        />
                        <AvatarFallback className="bg-dark-200 text-white text-sm">
                          {getInitials(profile?.full_name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        closeMobileMenu();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-[#59DECA] text-[#0D161A] hover:bg-[#4bc7b5] font-bold"
                  >
                    <Link href="/sign-in" onClick={closeMobileMenu}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
