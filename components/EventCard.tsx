"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/events/${slug}`} className="event-card group">
      <div className="event-card-image">
        <Image
          src={image}
          alt={title}
          width={410}
          height={240}
          className="poster"
        />
        <button
          onClick={handleFavorite}
          className="favorite-btn"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#5dfeca" : "none"}
            stroke={isFavorite ? "#5dfeca" : "white"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="event-card-content">
        <div className="event-location">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <span>{location}</span>
        </div>

        <h4 className="event-title">{title}</h4>

        <div className="event-datetime">
          <div className="event-date">
            <Image
              src="/icons/calendar.svg"
              alt="date"
              width={14}
              height={14}
            />
            <span>{date}</span>
          </div>
          <div className="event-time">
            <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
