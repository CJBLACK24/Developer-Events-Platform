"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { createBooking } from "@/lib/actions/booking.actions";
import TicketDisplay from "./TicketDisplay";

// --- Schema & Types ---

const bookingSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  techFocus: z.string().optional(),
  hobby: z.string().optional(),
  whyAttend: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingWizardProps {
  eventId: string;
  slug: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

export default function BookingWizard({
  eventId,
  slug,
  eventTitle,
  eventDate,
  eventLocation,
}: BookingWizardProps) {
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      jobTitle: "",
      company: "",
      techFocus: "",
      hobby: "",
      whyAttend: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Watch phone to ensure we can enforce numeric input if needed,
  // though regex in Zod handles validation.
  // We can also prevent non-numeric input onKeyDown.

  // --- Handlers ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // We'll store the uploaded URL in a hidden field or just keep it in state
      // to pass to createBooking. For now, state is fine.
      // (Optional: setValue("avatarUrl", data.url))
      console.log("Uploaded avatar:", data.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
      // Revert preview on failure? Or just show warning.
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    // clear value if we were storing it
  };

  const onSubmit = async (data: BookingFormValues) => {
    setError("");

    try {
      const result = await createBooking({
        eventId,
        slug,
        email: data.email,
        name: data.name,
        metadata: {
          phone: data.phone,
          jobTitle: data.jobTitle,
          company: data.company,
          techFocus: data.techFocus,
          hobby: data.hobby,
          whyAttend: data.whyAttend,
          avatarUrl: avatarPreview || "", // Pass the preview/uploaded URL
        },
      });

      if (result.success && result.ticket) {
        setTicketData({
          ...result.ticket,
          eventName: eventTitle,
          attendeeName: data.name,
          date: eventDate,
          location: eventLocation,
          // Pass avatar to ticket if supported
          avatarUrl: avatarPreview,
        });
        setSuccess(true);
      } else {
        setError(result.error || "Failed to book. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred.");
    }
  };

  // --- Render ---

  if (success && ticketData) {
    return <TicketDisplay ticket={ticketData} />;
  }

  return (
    <div className="w-full bg-[#0D161A] border-[#182830] border rounded-xl p-6 relative overflow-hidden text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="relative">
            {avatarPreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#59DECA]">
                <Image
                  src={avatarPreview}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute top-0 right-0 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="avatar-upload"
                className="w-24 h-24 rounded-full bg-[#243B47] border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#59DECA] transition-colors group"
              >
                <Upload className="w-6 h-6 text-zinc-400 group-hover:text-[#59DECA] mb-1" />
                <span className="text-[10px] text-zinc-400 group-hover:text-white uppercase font-medium">
                  Upload
                </span>
              </label>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          {uploading && (
            <span className="text-xs text-zinc-400 animate-pulse">
              Uploading...
            </span>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[#E7F2FF] font-normal">
            Full Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="First & Last Name"
            {...register("name")}
            className="text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-[#59DECA]"
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[#E7F2FF] font-normal">
            Email Address <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className="text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-[#59DECA]"
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-[#E7F2FF] font-normal">
            Phone Number <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none">
              <span className="text-lg mr-2">🇵🇭</span>
            </div>
            <Input
              id="phone"
              // Enforce strictly numeric typing prevention in UI, additional to Zod
              onKeyDown={(e) => {
                const allowed = [
                  "Backspace",
                  "Tab",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                  "Enter",
                ];
                if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="0912 345 6789"
              {...register("phone")}
              className="text-white placeholder:text-zinc-500 pl-12 focus:ring-1 focus:ring-[#59DECA]"
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* Job & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="jobTitle"
              className="text-[#E7F2FF] font-normal text-xs"
            >
              Job Title / Role (optional)
            </Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Engineer"
              {...register("jobTitle")}
              className="text-white placeholder:text-zinc-500 text-sm focus:ring-1 focus:ring-[#59DECA]"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="company"
              className="text-[#E7F2FF] font-normal text-xs"
            >
              Company (optional)
            </Label>
            <Input
              id="company"
              placeholder="e.g. Acme Inc"
              {...register("company")}
              className="text-white placeholder:text-zinc-500 text-sm focus:ring-1 focus:ring-[#59DECA]"
            />
          </div>
        </div>

        {/* Tech Focus */}
        <div className="space-y-1.5">
          <Label className="text-[#E7F2FF] font-normal">
            Tech Focus / Interest
          </Label>
          <Select onValueChange={(val) => setValue("techFocus", val)}>
            <SelectTrigger className="bg-[#182830] border border-[#243B47] text-white focus:ring-1 focus:ring-[#59DECA]">
              <SelectValue placeholder="Select your primary interest" />
            </SelectTrigger>
            <SelectContent className="bg-[#182830] border-[#243B47] text-white">
              <SelectItem value="frontend">Frontend Engineering</SelectItem>
              <SelectItem value="backend">Backend & Infrastructure</SelectItem>
              <SelectItem value="ai">AI / Machine Learning</SelectItem>
              <SelectItem value="mobile">Mobile Development</SelectItem>
              <SelectItem value="design">Product Design</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hobby */}
        <div className="space-y-1.5">
          <Label htmlFor="hobby" className="text-[#E7F2FF] font-normal">
            Hobby & Interests
          </Label>
          <Input
            id="hobby"
            placeholder="e.g. Coding, Reading Books"
            {...register("hobby")}
            className="text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-[#59DECA]"
          />
        </div>

        {/* Why Attend */}
        <div className="space-y-1.5">
          <Label htmlFor="whyAttend" className="text-[#E7F2FF] font-normal">
            Why do you want to attend?
          </Label>
          <textarea
            id="whyAttend"
            rows={3}
            placeholder="What are you hoping to learn or achieve?"
            {...register("whyAttend")}
            className="flex w-full rounded-md border border-[#243B47] bg-[#182830] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#59DECA] placeholder:text-zinc-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-[#59DECA] text-[#182830] hover:bg-[#4bc7b5] font-bold text-base py-6 transition-transform active:scale-95"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
