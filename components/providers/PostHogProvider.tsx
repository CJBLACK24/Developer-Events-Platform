"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // PostHog is already initialized in instrumentation-client.ts
    // This provider just wraps children with the PostHog context
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Custom hook exports for easy access
export {
  usePostHog,
  useFeatureFlagEnabled,
  useFeatureFlagPayload,
} from "posthog-js/react";
