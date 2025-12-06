"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const eventTypes = [
  "Conference",
  "Meetup",
  "Hackathon",
  "Workshop",
  "Webinar",
  "Summit",
];

const CreateEventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    eventType: "",
    tags: "",
    description: "",
    overview: "",
    agenda: "",
    audience: "",
    organizer: "",
    mode: "offline",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      submitFormData.append("title", formData.title);
      submitFormData.append("slug", slug);
      submitFormData.append("date", formData.date);
      submitFormData.append("time", formData.time);
      submitFormData.append("location", formData.location);
      submitFormData.append("venue", formData.venue);
      submitFormData.append("mode", formData.mode);
      submitFormData.append("description", formData.description);
      submitFormData.append(
        "overview",
        formData.overview || formData.description
      );
      submitFormData.append("audience", formData.audience || "Developers");
      submitFormData.append("organizer", formData.organizer || "Community");

      // Parse tags and agenda as JSON arrays
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const agendaArray = formData.agenda
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      submitFormData.append("tags", JSON.stringify(tagsArray));
      submitFormData.append("agenda", JSON.stringify(agendaArray));

      if (imageFile) {
        submitFormData.append("image", imageFile);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        const error = await response.json();
        console.error("Failed to create event:", error);
        alert("Failed to create event: " + error.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      {/* Event Title */}
      <div className="form-group">
        <label htmlFor="title">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter event title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Event Date */}
      <div className="form-group">
        <label htmlFor="date">Event Date</label>
        <div className="input-with-icon">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={16}
            height={16}
          />
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Event Time */}
      <div className="form-group">
        <label htmlFor="time">Event Time</label>
        <div className="input-with-icon">
          <Image src="/icons/clock.svg" alt="clock" width={16} height={16} />
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Event Location (City) */}
      <div className="form-group">
        <label htmlFor="location">Location (City/State)</label>
        <div className="input-with-icon">
          <Image src="/icons/pin.svg" alt="location" width={16} height={16} />
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. San Francisco, CA"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Event Venue */}
      <div className="form-group">
        <label htmlFor="venue">Venue Name</label>
        <div className="input-with-icon">
          <Image src="/icons/pin.svg" alt="venue" width={16} height={16} />
          <input
            type="text"
            id="venue"
            name="venue"
            placeholder="e.g. Moscone Center or Online URL"
            value={formData.venue}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Event Type */}
      <div className="form-group">
        <label htmlFor="eventType">Event Type</label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select event type</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Event Mode */}
      <div className="form-group">
        <label htmlFor="mode">Event Mode</label>
        <select
          id="mode"
          name="mode"
          value={formData.mode}
          onChange={handleInputChange}
          required
        >
          <option value="offline">In-person</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* Event Image */}
      <div className="form-group">
        <label>Event Image / Banner</label>
        <div className="image-upload">
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            required={!imageFile}
          />
          <label htmlFor="image" className="upload-btn">
            {imagePreview ? (
              <div className="image-preview">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={120}
                  className="preview-img"
                />
                <span>Click to change image</span>
              </div>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Upload event image or banner</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="Add tags separated by comma (e.g. react, nextjs)"
          value={formData.tags}
          onChange={handleInputChange}
        />
      </div>

      {/* Event Description */}
      <div className="form-group">
        <label htmlFor="description">Event Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Briefly describe the event"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      {/* Overview */}
      <div className="form-group">
        <label htmlFor="overview">Overview</label>
        <textarea
          id="overview"
          name="overview"
          placeholder="Detailed overview of the event"
          value={formData.overview}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      {/* Agenda */}
      <div className="form-group">
        <label htmlFor="agenda">Agenda (one item per line)</label>
        <textarea
          id="agenda"
          name="agenda"
          placeholder="09:30 AM - 10:30 AM | Opening Keynote&#10;10:45 AM - 12:00 PM | Breakout Sessions"
          value={formData.agenda}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      {/* Audience */}
      <div className="form-group">
        <label htmlFor="audience">Target Audience</label>
        <input
          type="text"
          id="audience"
          name="audience"
          placeholder="Developers, DevOps engineers, tech leaders"
          value={formData.audience}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Organizer */}
      <div className="form-group">
        <label htmlFor="organizer">About the Organizer</label>
        <textarea
          id="organizer"
          name="organizer"
          placeholder="Tell us about the organizer"
          value={formData.organizer}
          onChange={handleInputChange}
          rows={3}
          required
        />
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
};

export default CreateEventForm;
