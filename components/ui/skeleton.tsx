"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states
 * Displays an animated placeholder matching the dark theme
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#243B47]", className)}
      {...props}
    />
  );
}

export { Skeleton };
