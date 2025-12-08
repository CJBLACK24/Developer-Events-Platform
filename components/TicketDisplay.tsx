/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code"; // Client-side QR is easier for display

interface TicketProps {
  ticket: {
    ticketCode: string; // The unique code e.g. DE-A8B9
    eventName: string;
    attendeeName: string;
    date: string;
    location: string;
  };
}

export default function TicketDisplay({ ticket }: TicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

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

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#0F172A", // Ensure dark background is captured
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${ticket.eventName.replace(/\s+/g, "_")}_Ticket.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">You&apos;re In! 🎉</h2>
        <p className="text-gray-400">See you at the event.</p>
      </div>

      {/* TICKET CARD */}
      <div
        id="ticket-node"
        ref={ticketRef}
        className="bg-linear-to-br from-dark-200 to-dark-100 border border-[#59DECA]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(89,222,202,0.1)] relative"
      >
        {/* Decorative Top */}
        <div className="h-2 bg-[#59DECA] w-full" />

        <div className="p-6 space-y-6 relative">
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
            <span className="inline-block px-2 py-1 rounded bg-[#59DECA]/10 text-[#59DECA] text-xs font-bold tracking-widest uppercase mb-2">
              Official Ticket
            </span>
            <h3 className="text-xl font-bold text-white leading-tight">
              {ticket.eventName}
            </h3>
          </div>

          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Attendee
              </p>
              <p className="text-white font-medium">{ticket.attendeeName}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Date
              </p>
              <p className="text-white font-medium">{ticket.date}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="bg-white p-2 rounded-lg">
              <QRCode value={ticket.ticketCode} size={64} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Ticket Code
              </p>
              <p className="text-2xl font-mono text-[#59DECA] font-bold tracking-wider">
                {ticket.ticketCode}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">{ticket.location}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={downloadPDF}
          className="flex-1 bg-white text-black hover:bg-gray-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </motion.div>
  );
}
