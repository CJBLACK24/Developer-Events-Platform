import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { getAllEvents } from "@/lib/actions/event.actions";

export const dynamic = "force-dynamic";

interface IEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  mode: string;
  tags: string[];
  organizer: string;
}

const Page = async () => {
  const events = await getAllEvents();

  return (
    <>
      {/* Hero Section - Centered */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            The Hub for Every Dev <br /> Event You Can&apos;t Miss
          </h1>
          <p className="text-gray-400 mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
            Hackathons, Meetups, and Conferences, All in One Place
          </p>

          <div className="mt-8">
            <ExploreBtn />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="featured-events" className="container mx-auto px-4 py-16">
        {events && events.length > 0 ? (
          <>
            <h3 className="text-2xl font-bold mb-8">Featured Events</h3>
            <ul className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: IEvent) => (
                <li key={event.title} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No Events yet</p>
            <p className="text-sm mt-2">
              Check back soon for upcoming developer events!
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
