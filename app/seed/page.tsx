"use client";

import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const seedDatabase = async () => {
    setIsLoading(true);
    setStatus("Seeding database...");

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearDatabase = async () => {
    setIsLoading(true);
    setStatus("Clearing database...");

    try {
      const response = await fetch("/api/seed", {
        method: "DELETE",
      });
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <h1>Database Seed Page</h1>
      <p className="text-light-200">
        Use this page to populate or clear the database with sample events.
      </p>

      <div className="flex gap-4">
        <button
          onClick={seedDatabase}
          disabled={isLoading}
          className="button-submit"
        >
          {isLoading ? "Loading..." : "Seed Database"}
        </button>

        <button
          onClick={clearDatabase}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          Clear Database
        </button>
      </div>

      {status && (
        <div className="bg-dark-200 px-6 py-4 rounded-lg text-center max-w-md">
          <p>{status}</p>
        </div>
      )}
    </section>
  );
}
