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
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div id="featured-events" className="mt-20 space-y-7">
        {events && events.length > 0 ? (
          <>
            <h3>Featured Events</h3>
            <ul className="events">
              {events.map((event: IEvent) => (
                <li key={event.title} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-xl">No Events yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
