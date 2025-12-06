"use client";

import { useEffect } from "react";
import { usePostHog } from "@/components/providers/PostHogProvider";

interface EventViewProps {
  eventId: string;
  eventSlug: string;
  eventTitle?: string;
  eventTags?: string[];
}

/**
 * Component to track event page views
 * Include this component on event detail pages
 */
export function EventViewTracker({
  eventId,
  eventSlug,
  eventTitle,
  eventTags,
}: EventViewProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("event_viewed", {
      event_id: eventId,
      event_slug: eventSlug,
      event_title: eventTitle,
      event_tags: eventTags,
    });
  }, [eventId, eventSlug, eventTitle, eventTags, posthog]);

  return null; // This is a tracking-only component
}

/**
 * Custom hook for tracking specific events
 */
export function useTrackEvent() {
  const posthog = usePostHog();

  return {
    trackSearch: (query: string, resultsCount: number) => {
      posthog.capture("events_searched", {
        search_query: query,
        results_count: resultsCount,
      });
    },
    trackFilter: (filterType: string, filterValue: string) => {
      posthog.capture("events_filtered", {
        filter_type: filterType,
        filter_value: filterValue,
      });
    },
    trackShare: (eventSlug: string, platform: string) => {
      posthog.capture("event_shared", {
        event_slug: eventSlug,
        share_platform: platform,
      });
    },
    trackNavigation: (destination: string) => {
      posthog.capture("navigation", {
        destination: destination,
      });
    },
  };
}
