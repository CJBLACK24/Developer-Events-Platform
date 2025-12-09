"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-[120px] sm:text-[180px] font-bold bg-linear-to-br from-[#59DECA] via-[#3db8a8] to-[#59DECA] bg-clip-text text-transparent leading-none">
            404
          </span>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-zinc-400 text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            className="bg-[#59DECA] text-black hover:bg-[#4bc9b8] px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-6"
          >
            <Link href="/events">
              <Search className="w-4 h-4 mr-2" />
              Browse Events
            </Link>
          </Button>
        </motion.div>

        {/* Go Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
