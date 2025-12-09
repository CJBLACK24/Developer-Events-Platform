import { notFound } from "next/navigation";
import {
  getEventBySlug,
  getSimilarEventsBySlug,
} from "@/lib/actions/event.actions";
import Image from "next/image";
import BookingWizard from "@/components/booking/BookingWizard";
import EventCard from "@/components/events/EventCard";

// Temporary interface until we have a shared types file
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
  overview: string;
  agenda: string[];
  audience: string;
  organizer: string;
}

const formatMode = (mode: string) => {
  switch (mode) {
    case "offline":
      return "In-person";
    case "online":
      return "Online";
    case "hybrid":
      return "Hybrid";
    default:
      return mode;
  }
};

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  const slug = await params;

  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const {
    title,
    description,
    image,
    overview,
    date,
    time,
    location,
    venue,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section className="event-details-page mt-10">
      {/* Header Section */}
      <div className="event-header">
        <h1>{title}</h1>
        <p className="event-tagline">{description}</p>
      </div>

      {/* Main Content */}
      <div className="event-content">
        {/* Left Side - Event Details */}
        <div className="event-main">
          {/* Event Banner */}
          <div className="event-banner">
            <Image
              src={image}
              alt={title}
              width={800}
              height={450}
              className="banner-image"
            />
          </div>

          {/* Overview Section */}
          <div className="event-section">
            <h2>Overview</h2>
            <p>{overview}</p>
          </div>

          {/* Event Details Section */}
          <div className="event-section">
            <h2>Event Details</h2>
            <div className="details-list">
              <div className="detail-item">
                <Image
                  src="/icons/calendar.svg"
                  alt="date"
                  width={18}
                  height={18}
                />
                <span>Date: {date}</span>
              </div>
              <div className="detail-item">
                <Image
                  src="/icons/clock.svg"
                  alt="time"
                  width={18}
                  height={18}
                />
                <span>Time: {time}</span>
              </div>
              <div className="detail-item">
                <Image
                  src="/icons/pin.svg"
                  alt="venue"
                  width={18}
                  height={18}
                />
                <span>
                  Location: {location} {venue ? `(${venue})` : ""}
                </span>
              </div>
              <div className="detail-item">
                <Image
                  src="/icons/mode.svg"
                  alt="mode"
                  width={18}
                  height={18}
                />
                <span>Mode: {formatMode(mode)}</span>
              </div>
              <div className="detail-item">
                <Image
                  src="/icons/audience.svg"
                  alt="audience"
                  width={18}
                  height={18}
                />
                <span>Audience: {audience}</span>
              </div>
            </div>
          </div>

          {/* Agenda Section */}
          {agenda && agenda.length > 0 && (
            <div className="event-section">
              <h2>Agenda</h2>
              <ul className="agenda-list">
                {agenda.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Organizer Section */}
          <div className="event-section">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </div>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <div className="event-tags">
              {tags.map((tag: string) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Booking Form */}
        <aside className="event-sidebar">
          <BookingWizard
            eventId={event._id}
            slug={slug}
            eventTitle={title}
            eventDate={date}
            eventLocation={location}
          />
        </aside>
      </div>

      {/* Similar Events Section */}
      {similarEvents.length > 0 && (
        <div className="similar-events">
          <h2>Similar events</h2>
          <div className="events-grid">
            {similarEvents.slice(0, 3).map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.slug} {...similarEvent} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventDetails;
