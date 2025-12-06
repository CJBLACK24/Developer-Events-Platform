import { PostHog } from "posthog-node";

// Server-side PostHog client singleton
let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      flushAt: 1, // Flush events immediately in serverless environments
      flushInterval: 0,
    });
  }
  return posthogClient;
}

// Shutdown function for cleanup
export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}

// Helper to capture server-side events
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHogServer();
  client.capture({
    distinctId,
    event,
    properties,
  });
}

// Helper to identify users on the server
export function identifyServerUser(
  distinctId: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHogServer();
  client.identify({
    distinctId,
    properties,
  });
}
