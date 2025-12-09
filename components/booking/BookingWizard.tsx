"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { Loader2, LogIn } from "lucide-react";
import { createBooking } from "@/lib/actions/booking.actions";
import TicketDisplay from "./TicketDisplay";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAuth } from "@/components/providers/AuthProvider";

// --- Schema & Types ---

const bookingSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => val.endsWith("@gmail.com"), {
      message: "Only @gmail.com addresses are allowed",
    }),
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

// Helper to get localStorage key for this event
const getTicketStorageKey = (slug: string) => `ticket_${slug}`;

export default function BookingWizard({
  eventId,
  slug,
  eventTitle,
  eventDate,
  eventLocation,
}: BookingWizardProps) {
  // Authentication state
  const { user, loading: authLoading } = useAuth();

  // Initialize from localStorage if available
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load ticket from localStorage on mount
  useEffect(() => {
    const storageKey = getTicketStorageKey(slug);
    const savedTicket = localStorage.getItem(storageKey);
    if (savedTicket) {
      try {
        const parsed = JSON.parse(savedTicket);
        setTicketData(parsed);
        setSuccess(true);
      } catch (e) {
        console.error("Failed to parse saved ticket", e);
        localStorage.removeItem(storageKey);
      }
    }
  }, [slug]);

  // Persist ticket to localStorage when it changes
  useEffect(() => {
    if (ticketData && success) {
      const storageKey = getTicketStorageKey(slug);
      localStorage.setItem(storageKey, JSON.stringify(ticketData));
    }
  }, [ticketData, success, slug]);

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

  // Pre-fill email from authenticated user
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  // --- Handlers ---

  /**
   * Handle avatar file selection from AvatarUpload component
   */
  const handleAvatarSelect = async (file: File) => {
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

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="w-full bg-[#0D161A] border-[#182830] border rounded-xl p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#59DECA] mx-auto" />
        <p className="text-zinc-400 mt-4">Checking authentication...</p>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="w-full bg-[#0D161A] border-[#182830] border rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-[#243B47] rounded-full flex items-center justify-center">
          <LogIn className="w-8 h-8 text-[#59DECA]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Sign in to Book</h3>
          <p className="text-zinc-400 text-sm">
            You need to be signed in to book your spot at this event.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-[#59DECA] text-[#0D161A] hover:bg-[#4bc7b5] font-bold"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <p className="text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#59DECA] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
        Book Your Spot
      </h2>

      <div className="bg-[#0D161A] border-[#182830] border rounded-xl p-4 sm:p-6 relative overflow-hidden text-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center justify-center mb-2">
            <AvatarUpload
              onFileSelect={handleAvatarSelect}
              onRemove={removeAvatar}
              previewUrl={avatarPreview}
              uploading={uploading}
              size="md"
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[#E7F2FF] font-normal">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register("name")}
              className="text-white focus:ring-1 focus:ring-[#59DECA]"
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
              placeholder="Enter your email"
              {...register("email")}
              className="text-white focus:ring-1 focus:ring-[#59DECA]"
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
                placeholder="Enter your phone number (e.g. 09123456789)"
                {...register("phone")}
                className="text-white pl-12 focus:ring-1 focus:ring-[#59DECA]"
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
                placeholder="Enter your job title"
                {...register("jobTitle")}
                className="text-white text-sm focus:ring-1 focus:ring-[#59DECA]"
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
                placeholder="Enter your company name"
                {...register("company")}
                className="text-white text-sm focus:ring-1 focus:ring-[#59DECA]"
              />
            </div>
          </div>

          {/* Tech Focus */}
          <div className="space-y-1.5">
            <Label className="text-[#E7F2FF] font-normal">
              Tech Focus / Interest
            </Label>
            <Select onValueChange={(val) => setValue("techFocus", val)}>
              <SelectTrigger className="bg-[#182830] border border-[#243B47] focus:ring-1 focus:ring-[#59DECA] ">
                <SelectValue placeholder="Select your primary interest" />
              </SelectTrigger>
              <SelectContent className="bg-[#182830] border-[#DCFFF8] text-white">
                <SelectItem value="frontend">Frontend Engineering</SelectItem>
                <SelectItem value="backend">
                  Backend & Infrastructure
                </SelectItem>
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
              className="text-white focus:ring-1 focus:ring-[#59DECA]"
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
              className="flex w-full rounded-md border border-[#243B47] bg-[#182830] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#59DECA] placeholder:text-[#DCFFF8]"
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
    </div>
  );
}
