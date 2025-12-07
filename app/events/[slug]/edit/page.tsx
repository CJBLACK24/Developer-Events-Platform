"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import supabase from "@/lib/supabase";
import { generateSlug, normalizeDate, normalizeTime } from "@/lib/utils";
import Link from "next/link";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { Clock } from "lucide-react";

const eventTypes = [
  "Conference",
  "Meetup",
  "Hackathon",
  "Workshop",
  "Webinar",
  "Summit",
];

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  mode: string;
  description: string;
  overview: string;
  audience: string;
  organizer: string;
  tags: string[];
  agenda: string[];
  image: string;
  organizer_id: string;
  is_approved: boolean;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, profile, loading: authLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    startTime: "",
    endTime: "",
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

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error("Error fetching event:", error);
        router.push("/admin");
        return;
      }

      setEvent(data);

      // Parse time string (e.g. "12:25pm - 2:40pm")
      let startTime = "";
      let endTime = "";

      // Actually, since input[type="time"] expects HH:mm (24h), and we store "12:25pm", parsing is needed.
      // Let's simpler approach: if we can't easily parse, just let user re-enter or keep as is?
      // User request implies updating the field.
      // I'll add a helper helper to convert "12:25pm" -> "12:25" (24h)

      const convertTo24Hour = (timeStr: string) => {
        const [time, modifier] = timeStr.split(/(am|pm)/i);
        let [hours, minutes] = time.split(":");
        if (!hours || !minutes) return "";
        if (modifier.toLowerCase() === "pm" && hours !== "12") {
          hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier.toLowerCase() === "am" && hours === "12") {
          hours = "00";
        }
        return `${hours}:${minutes}`;
      };

      if (data.time && data.time.includes(" - ")) {
        const parts = data.time.split(" - ");
        startTime = convertTo24Hour(parts[0]);
        endTime = convertTo24Hour(parts[1]);
      }

      setFormData({
        title: data.title || "",
        date: data.date || "",
        time: data.time || "",
        startTime: startTime,
        endTime: endTime,
        location: data.location || "",
        venue: data.venue || "",
        eventType: data.event_type || "",
        tags: data.tags?.join(", ") || "",
        description: data.description || "",
        overview: data.overview || "",
        agenda: data.agenda?.join("\n") || "",
        audience: data.audience || "",
        organizer: data.organizer || "",
        mode: data.mode || "offline",
      });
      setImagePreview(data.image || null);
      setLoading(false);
    };

    fetchEvent();
  }, [slug, router]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || (profile?.role !== "organizer" && profile?.role !== "admin")) {
    return (
      <div className="text-center p-10 border border-red-500 rounded-xl bg-red-900/20">
        <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
        <p className="mt-2">
          You must be an Verified Organizer to edit events.
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
    if (!event) return;

    setIsSubmitting(true);

    try {
      let imageUrl = event.image;

      // 1. Upload new image if provided
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
      }

      // 2. Prepare Data
      const newSlug =
        formData.title !== event.title
          ? generateSlug(formData.title)
          : event.slug;

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const agendaArray = formData.agenda
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const formattedDate = normalizeDate(formData.date);
      const timeString = `${normalizeTime(
        formData.startTime
      )} - ${normalizeTime(formData.endTime)}`;

      // 3. Update in Supabase
      const { error } = await supabase
        .from("events")
        .update({
          title: formData.title,
          slug: newSlug,
          date: formattedDate,
          time: timeString,
          location: formData.location,
          venue: formData.venue,
          mode: formData.mode,
          description: formData.description,
          overview: formData.overview || formData.description,
          audience: formData.audience || "Developers",
          organizer: formData.organizer || "Community",
          tags: tagsArray,
          agenda: agendaArray,
          image: imageUrl,
        })
        .eq("id", event.id);

      if (error) throw error;

      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Edit Event
        </h1>
        <Link href="/admin">
          <button className="text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

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
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Clock className="w-5 h-5 text-white group-hover:text-[#59DECA] transition-colors duration-200" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-200 text-white rounded-lg pl-12 pr-4 py-3 border border-dark-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <span className="text-gray-400 font-medium">to</span>
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Clock className="w-5 h-5 text-white group-hover:text-[#59DECA] transition-colors duration-200" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-200 text-white rounded-lg pl-12 pr-4 py-3 border border-dark-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
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
          {isSubmitting ? "Updating..." : "Update Event"}
        </button>

        <SuccessDialog
          open={showSuccessDialog}
          onClose={() => {
            setShowSuccessDialog(false);
            router.push("/admin");
            router.refresh();
          }}
          title="Event Updated!"
          message="Your event has been successfully updated."
          buttonText="Back to Dashboard"
        />
      </form>
    </div>
  );
}
