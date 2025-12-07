"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import supabase from "@/lib/supabase";
import { generateSlug, normalizeDate, normalizeTime } from "@/lib/utils";
import { SuccessDialog } from "@/components/ui/success-dialog";

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
  const { user, profile, loading } = useAuth();
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/events/create");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center p-10">Loading...</p>;

  if (!user || (profile?.role !== "organizer" && profile?.role !== "admin")) {
    return (
      <div className="text-center p-10 border border-red-500 rounded-xl bg-red-900/20">
        <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
        <p className="mt-2">
          You must be an Verified Organizer to create events.
        </p>
        <p className="text-sm mt-4 text-gray-400">
          (For this demo, ask the admin to upgrade your role or run the SQL with
          Admin/Organizer role setup)
        </p>
      </div>
    );
  }

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
      let imageUrl = "";

      // 1. Upload Image
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      } else {
        alert("Please upload an image");
        setIsSubmitting(false);
        return;
      }

      // 2. Prepare Data
      const slug = generateSlug(formData.title);
      // Ensure unique slug (simple append random string if needed, or let DB fail)
      // For UX, checking first is better, but keep it simple for now.

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const agendaArray = formData.agenda
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const formattedDate = normalizeDate(formData.date);
      const formattedTime = normalizeTime(formData.time);

      // 3. Insert into Supabase
      const { error } = await supabase.from("events").insert({
        title: formData.title,
        slug: slug,
        date: formattedDate,
        time: formattedTime,
        location: formData.location,
        venue: formData.venue,
        mode: formData.mode,
        description: formData.description,
        overview: formData.overview || formData.description,
        audience: formData.audience || "Developers",
        organizer: formData.organizer || "Community", // Display name
        tags: tagsArray,
        agenda: agendaArray,
        image: imageUrl,
        organizer_id: user.id, // Link to RBAC user
        is_approved: true, // Auto-approve for now, or false if you want approval flow
      });

      if (error) throw error;

      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. " + (error as Error).message);
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

      <SuccessDialog
        open={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          router.push("/");
          router.refresh();
        }}
        title="Event Created!"
        message="Your event has been successfully created and is now live."
        buttonText="View Events"
      />
    </form>
  );
};

export default CreateEventForm;
