import { Metadata } from "next";
import EventsPageClient from "./EventsPageClient";

export const metadata: Metadata = {
  title: "Browse Events | DevEvent",
  description:
    "Discover hackathons, meetups, and tech conferences. Find your next developer event and connect with the tech community.",
  openGraph: {
    title: "Browse Events | DevEvent",
    description:
      "Discover hackathons, meetups, and tech conferences. Find your next developer event.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default function EventsPage() {
  return <EventsPageClient />;
}
