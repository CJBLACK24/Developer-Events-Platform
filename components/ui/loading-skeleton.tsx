"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for Event Cards
 * Used when fetching events list
 */
export function EventCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Image placeholder */}
      <Skeleton className="h-[200px] w-full rounded-xl" />
      {/* Location */}
      <Skeleton className="h-4 w-24" />
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      {/* Date and time */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Events Grid
 * Displays multiple event card skeletons with correct layout
 */
export function EventsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden h-[400px]"
        >
          <Skeleton className="h-[200px] w-full" />
          <div className="p-5 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for the Admin Dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#182830] border border-[#182830] rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 bg-gray-700/50" />
              <Skeleton className="h-8 w-8 rounded-md bg-gray-700/50" />
            </div>
            <Skeleton className="h-8 w-16 bg-gray-700/50" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl overflow-hidden bg-[#0c151a] border border-[#182830]">
        <div className="h-12 bg-[#182830] flex items-center px-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 bg-gray-700/30" />
          ))}
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-10 w-14 rounded-lg bg-gray-800/50" />
              <Skeleton className="h-4 flex-1 bg-gray-800/50" />
              <Skeleton className="h-4 flex-1 bg-gray-800/50" />
              <Skeleton className="h-4 flex-1 bg-gray-800/50" />
              <Skeleton className="h-4 w-20 bg-gray-800/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for Booking Form
 * Used on event details page while form loads
 */
export function BookingFormSkeleton() {
  return (
    <div className="w-full bg-[#0D161A] border-[#182830] border rounded-xl p-6 space-y-5">
      {/* Avatar upload */}
      <div className="flex justify-center">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>
      {/* Form fields */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {/* Button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}

/**
 * Loading skeleton for Event Details page
 * Full page loading state
 */
export function EventDetailsSkeleton() {
  return (
    <section className="event-details-page mt-10">
      {/* Header */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-16 mt-8">
        {/* Left - Event Details */}
        <div className="flex-2 flex flex-col gap-8">
          <Skeleton className="h-[450px] w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Right - Booking Form */}
        <div className="flex-1">
          <BookingFormSkeleton />
        </div>
      </div>
    </section>
  );
}

/**
 * Loading skeleton for Profile page
 */
export function ProfileSkeleton() {
  return (
    <section className="container mx-auto px-4 py-10 max-w-2xl">
      <Skeleton className="h-10 w-40 mb-8" />
      <div className="bg-muted/50 p-6 rounded-lg border space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32" />
      </div>
    </section>
  );
}
