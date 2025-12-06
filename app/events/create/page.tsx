import Link from "next/link";

export default function CreateEventPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-center">Create Event</h1>
      <p className="text-center max-w-lg">
        This feature is coming soon! You'll be able to create and share your own
        developer events.
      </p>
      <Link href="/" className="button-submit">
        Back to Home
      </Link>
    </section>
  );
}
