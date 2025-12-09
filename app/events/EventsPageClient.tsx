"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/events/EventCard";

interface IEvent {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  mode: string;
  tags: string[];
  organizer: string;
}

const ITEMS_PER_PAGE = 9;

export default function EventsPageClient() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get unique tags from events
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach((event) => {
      event.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Mode filter
    if (selectedMode !== "all") {
      filtered = filtered.filter(
        (event) => event.mode?.toLowerCase() === selectedMode.toLowerCase()
      );
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter((event) =>
        event.tags?.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    // Sort
    switch (sortBy) {
      case "date":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "date-desc":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [events, searchQuery, selectedMode, selectedTag, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMode, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMode("all");
    setSelectedTag("all");
    setSortBy("date");
  };

  const hasActiveFilters =
    searchQuery || selectedMode !== "all" || selectedTag !== "all";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-lg h-80 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Browse Events
        </h1>
        <p className="text-zinc-400">
          Discover {events.length} developer events happening near you
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Main Search */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Search events, locations, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#59DECA]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 sm:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className="ml-2 bg-[#59DECA] text-black text-xs">
                Active
              </Badge>
            )}
          </Button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Mode Filter */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Event Mode
                  </label>
                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="All Modes" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag Filter */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Category
                  </label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag.toLowerCase()}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="date">Date (Upcoming)</SelectItem>
                      <SelectItem value="date-desc">Date (Latest)</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-zinc-400 hover:text-white w-full"
                    disabled={!hasActiveFilters}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>
            Showing {paginatedEvents.length} of {filteredEvents.length} events
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[#59DECA] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Events Grid */}
      {paginatedEvents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {paginatedEvents.map((event, index) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <Search className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No events found
          </h3>
          <p className="text-zinc-400 mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={clearFilters}
            className="bg-[#59DECA] text-black hover:bg-[#4bc9b8]"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2"
        >
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and pages around current
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, arr) => (
                <div key={page} className="flex items-center gap-2">
                  {index > 0 && arr[index - 1] !== page - 1 && (
                    <span className="text-zinc-500">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-[#59DECA] text-black hover:bg-[#4bc9b8]"
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }
                  >
                    {page}
                  </Button>
                </div>
              ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
}
