"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions/booking.actions"; // We will update this
import TicketDisplay from "./TicketDisplay"; // We will create this

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
  const [ticketData, setTicketData] = useState<any>(null); // To store booked ticket

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    company: "",
    dietary: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Call Server Action
      const result = await createBooking({
        eventId,
        slug,
        email: formData.email,
        name: formData.name,
        metadata: {
          jobTitle: formData.jobTitle,
          company: formData.company,
          dietary: formData.dietary,
        },
      });

      if (result.success && result.ticket) {
        // Prepare ticket data for display
        setTicketData({
          ...result.ticket,
          eventName: eventTitle,
          attendeeName: formData.name,
          date: eventDate,
          location: eventLocation,
        });
        setStep(3); // Success step
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

  // If we have ticket data, show the celebration/ticket view
  if (step === 3 && ticketData) {
    return <TicketDisplay ticket={ticketData} />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-dark-200 border border-dark-300 rounded-xl p-6 shadow-2xl relative overflow-hidden">
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
            className="space-y-4 pt-4"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Contact Details
            </h2>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-dark-100 border-dark-300 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-dark-100 border-dark-300 text-white"
              />
            </div>
            <Button
              onClick={nextStep}
              className="w-full mt-4 bg-primary-500 text-black hover:bg-primary-400"
              disabled={!formData.name || !formData.email}
            >
              Next: Additional Info
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 pt-4"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              A Bit About You
            </h2>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-gray-300">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="bg-dark-100 border-dark-300 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Tech Corp"
                className="bg-dark-100 border-dark-300 text-white"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 border-dark-300 text-gray-300"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-primary-500 text-black hover:bg-primary-400"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
