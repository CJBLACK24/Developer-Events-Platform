"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { getBaseUrl } from "@/lib/config";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/callback`,
          data: {
            full_name: `${formData.firstname} ${formData.lastname}`.trim(),
          },
        },
      });

      if (error) throw error;
      setMessage("Check your email for the magic link!");
    } catch (error) {
      console.error(error);
      setMessage("Error signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-black">
      {/* Mobile Header Image */}
      <div className="lg:hidden relative w-full h-48 sm:h-56">
        <Image
          src="/images/event-full.png"
          alt="Event Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

        {/* Back Button - Mobile */}
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Left Side: Form */}
      <div className="flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8 lg:py-12 bg-black text-white relative">
        {/* Back Button - Desktop */}
        <Link
          href="/"
          className="hidden lg:flex absolute top-8 left-8 items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        <div className="w-full max-w-sm sm:max-w-md space-y-6 lg:space-y-8">
          <div className="text-center">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 lg:mb-6"
            >
              <Image
                src="/icons/logo.png"
                alt="DevEvent Logo"
                width={32}
                height={32}
              />
              <span className="text-lg lg:text-xl font-bold text-white">
                DevEvent
              </span>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join DevEvent to discover and host events.
            </p>
          </div>

          <form className="space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="firstname" className="text-zinc-300 text-sm">
                    First Name
                  </Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="mt-1.5 h-11 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastname" className="text-zinc-300 text-sm">
                    Last Name
                  </Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="mt-1.5 h-11 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-zinc-300 text-sm">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1.5 h-11 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {message && (
              <div className="rounded-lg bg-green-900/50 p-3 sm:p-4">
                <p className="text-sm text-green-300 text-center">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-semibold text-sm"
            >
              {loading ? "Sending Link..." : "Sign Up"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-zinc-500">Already have an account? </span>
              <Link
                href="/sign-in"
                className="font-medium text-white hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image - Desktop Only */}
      <div className="hidden lg:block relative h-full w-full">
        <Image
          src="/images/event-full.png"
          alt="Event Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
