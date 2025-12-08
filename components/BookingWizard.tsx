"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions/booking.actions";
import TicketDisplay from "./TicketDisplay";

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketData, setTicketData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    techFocus: "",
    hobby: "",
    whyAttend: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, techFocus: value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await createBooking({
        eventId,
        slug,
        email: formData.email,
        name: formData.name,
        metadata: {
          phone: formData.phone,
          jobTitle: formData.jobTitle,
          company: formData.company,
          techFocus: formData.techFocus,
          hobby: formData.hobby,
          whyAttend: formData.whyAttend,
        },
      });

      if (result.success && result.ticket) {
        setTicketData({
          ...result.ticket,
          eventName: eventTitle,
          attendeeName: formData.name,
          date: eventDate,
          location: eventLocation,
        });
        setStep(3);
      } else {
        setError(result.error || "Failed to book. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && ticketData) {
    return <TicketDisplay ticket={ticketData} />;
  }

  return (
    <div className="w-full bg-dark-200 border border-white/5 rounded-xl p-6 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-dark-300">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: "0%" }}
          animate={{ width: step === 1 ? "50%" : "90%" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 pt-2"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                Essential Information
              </h2>
              <p className="text-sm text-zinc-400">
                Let&apos;s get you on the list.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-zinc-300">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="First & Last Name"
                  className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-primary-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-zinc-300 flex justify-between"
                >
                  <span>Phone Number</span>
                  <span className="text-xs text-zinc-500 font-normal opacity-70">
                    Optional
                  </span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-primary-500"
                />
              </div>
            </div>

            <Button
              onClick={nextStep}
              className="w-full bg-primary-500 text-black hover:bg-primary-400 font-medium"
              disabled={!formData.name || !formData.email}
            >
              Next: Professional Profile
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5 pt-2"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">
                A Bit About You
              </h2>
              <p className="text-sm text-zinc-400">
                Context helps us tailor the experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="text-zinc-300 text-xs">
                    Job Title / Role
                  </Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Engineer"
                    className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-zinc-300 text-xs">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Inc"
                    className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-300">Tech Focus / Interest</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.techFocus}
                >
                  <SelectTrigger className="bg-dark-100 border-zinc-700 text-white">
                    <SelectValue placeholder="Select your primary interest" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-200 border-zinc-700 text-white">
                    <SelectItem value="frontend">
                      Frontend Engineering
                    </SelectItem>
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

              <div className="space-y-1.5">
                <Label htmlFor="hobby" className="text-zinc-300">
                  Hobby & Interests
                </Label>
                <Input
                  id="hobby"
                  name="hobby"
                  value={formData.hobby}
                  onChange={handleChange}
                  placeholder="e.g. Hiking, Gaming, Photography"
                  className="bg-dark-100 border-zinc-700 text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whyAttend" className="text-zinc-300">
                  Why do you want to attend?
                </Label>
                <textarea
                  id="whyAttend"
                  name="whyAttend"
                  value={formData.whyAttend}
                  onChange={handleChange}
                  placeholder="What are you hoping to learn or achieve?"
                  className="flex min-h-[60px] w-full rounded-md border border-zinc-700 bg-dark-100 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary-500 text-black hover:bg-primary-400 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
