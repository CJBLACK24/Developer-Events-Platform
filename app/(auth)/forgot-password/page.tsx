"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabase";
import { LogoIcon } from "@/components/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      setMessage("Password reset link sent to your email!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Link href="/">
                <LogoIcon />
              </Link>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-zinc-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {message && (
              <div className="rounded-md bg-green-900/50 p-4">
                <p className="text-sm text-green-300 text-center">{message}</p>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-900/50 p-4">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/sign-in"
                className="font-medium text-zinc-400 hover:text-white transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image */}
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
