/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Camera, Info } from "lucide-react";
import QRCode from "react-qr-code";

interface TicketProps {
  ticket: {
    ticketCode: string;
    eventName: string;
    attendeeName: string;
    date: string;
    location: string;
  };
}

export default function TicketDisplay({ ticket }: TicketProps) {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="w-full max-w-md mx-auto px-2 sm:px-0"
    >
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          You&apos;re In! 🎉
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          See you at the event.
        </p>
      </div>

      {/* TICKET CARD */}
      <div
        id="ticket-node"
        className="bg-gradient-to-br from-dark-200 to-dark-100 border border-[#59DECA]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(89,222,202,0.1)] relative"
      >
        {/* Decorative Top */}
        <div className="h-2 bg-[#59DECA] w-full" />

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative">
          {/* Watermark/Pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
            </svg>
          </div>

          <div>
            <span className="inline-block px-2 py-1 rounded bg-[#59DECA]/10 text-[#59DECA] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">
              Official Ticket
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white leading-tight break-words">
              {ticket.eventName}
            </h3>
          </div>

          <div className="flex justify-between items-start border-t border-white/10 pt-4 gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
                Attendee
              </p>
              <p className="text-white font-medium text-sm sm:text-base break-words">
                {ticket.attendeeName}
              </p>
            </div>
            <div className="space-y-1 text-right shrink-0">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
                Date
              </p>
              <p className="text-white font-medium text-sm sm:text-base whitespace-nowrap">
                {ticket.date}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <div className="bg-white p-1.5 sm:p-2 rounded-lg shrink-0">
              <QRCode
                value={ticket.ticketCode}
                size={56}
                className="sm:w-16 sm:h-16"
              />
            </div>
            <div className="flex-1 text-right min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide mb-1">
                Ticket Code
              </p>
              <p className="text-lg sm:text-2xl font-mono text-[#59DECA] font-bold tracking-wider break-all">
                {ticket.ticketCode}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              {ticket.location}
            </p>
          </div>
        </div>
      </div>

      {/* Screenshot Reminder */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#243B47]/50 border border-[#59DECA]/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#59DECA]/10 rounded-lg shrink-0">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#59DECA]" />
          </div>
          <div>
            <p className="text-white font-medium text-sm sm:text-base mb-1">
              Save Your Ticket
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Take a screenshot of this ticket to save it. You&apos;ll need to
              show this at the event entrance.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
