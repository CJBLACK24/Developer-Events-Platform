import { Suspense } from "react";
import EventDetails from "@/components/events/EventDetails";
import { EventDetailsSkeleton } from "@/components/ui/loading-skeleton";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = params.then((p) => p.slug);

  return (
    <main>
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};
export default EventDetailsPage;
