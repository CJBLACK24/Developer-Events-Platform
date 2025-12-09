import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";

// Initialize Arcjet with your API key
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // Track by IP address
  rules: [
    // Shield provides comprehensive protection against common attacks
    shield({
      mode: "LIVE",
    }),
    // Bot detection
    detectBot({
      mode: "LIVE",
      // Allow good bots like search engines
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),
    // Rate limiting - 100 requests per minute
    tokenBucket({
      mode: "LIVE",
      refillRate: 100,
      interval: 60,
      capacity: 100,
    }),
  ],
});

// Stricter rate limit for auth endpoints
export const authProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    // Stricter limit for auth: 10 requests per minute
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 10,
    }),
  ],
});

// Upload protection - tighter limits
export const uploadProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    // 20 uploads per minute
    tokenBucket({
      mode: "LIVE",
      refillRate: 20,
      interval: 60,
      capacity: 20,
    }),
  ],
});

// Booking protection - prevent spam bookings
export const bookingProtection = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    // 30 booking attempts per minute
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 60,
      capacity: 30,
    }),
  ],
});

export default aj;
