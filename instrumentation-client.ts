import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
  person_profiles: "identified_only", // Only create profiles for identified users
  capture_pageview: true, // Automatically capture page views
  capture_pageleave: true, // Capture when users leave page
  capture_exceptions: true, // Capture exceptions using Error Tracking
  autocapture: true, // Automatically capture clicks, form submissions, etc.
  debug: process.env.NODE_ENV === "development",
});
