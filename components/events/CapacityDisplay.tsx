"use client";

import { useEffect, useState } from "react";
import { getEventCapacity } from "@/lib/actions/booking.actions";
import { Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CapacityDisplayProps {
  eventId: string;
  showDetailed?: boolean;
}

export default function CapacityDisplay({
  eventId,
  showDetailed = false,
}: CapacityDisplayProps) {
  const [capacity, setCapacity] = useState<number | null>(null);
  const [booked, setBooked] = useState<number>(0);
  const [available, setAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const data = await getEventCapacity(eventId);
        setCapacity(data.capacity);
        setBooked(data.booked);
        setAvailable(data.available);
      } catch (error) {
        console.error("Failed to fetch capacity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapacity();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading availability...</span>
      </div>
    );
  }

  // If no capacity set, event has unlimited spots
  if (capacity === null) {
    return (
      <div className="flex items-center gap-2 text-zinc-400">
        <Users className="w-4 h-4" />
        <span className="text-sm">
          {booked > 0 ? `${booked} registered` : "Open registration"}
        </span>
      </div>
    );
  }

  const isSoldOut = available !== null && available <= 0;
  const isLowAvailability =
    available !== null && available <= 10 && available > 0;
  const percentFilled = capacity > 0 ? (booked / capacity) * 100 : 0;

  if (showDetailed) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#59DECA]" />
            <span className="text-sm text-zinc-300">Capacity</span>
          </div>
          {isSoldOut ? (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Sold Out
            </Badge>
          ) : isLowAvailability ? (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {available} spots left
            </Badge>
          ) : (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Available
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isSoldOut
                  ? "bg-red-500"
                  : isLowAvailability
                  ? "bg-orange-500"
                  : "bg-[#59DECA]"
              }`}
              style={{ width: `${Math.min(percentFilled, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 text-right">
            {booked} / {capacity} spots filled
          </p>
        </div>
      </div>
    );
  }

  // Compact view
  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-[#59DECA]" />
      {isSoldOut ? (
        <span className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Sold Out
        </span>
      ) : isLowAvailability ? (
        <span className="text-sm text-orange-400">
          Only {available} spots left!
        </span>
      ) : (
        <span className="text-sm text-zinc-400">
          {available} of {capacity} spots available
        </span>
      )}
    </div>
  );
}
