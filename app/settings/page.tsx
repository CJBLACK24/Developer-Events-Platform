/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  User,
  Shield,
  Mail,
  Check,
  AlertCircle,
  Ticket,
} from "lucide-react";
import MyTickets from "@/components/booking/MyTickets";
import { AvatarUpload } from "@/components/ui/avatar-upload";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile | tickets

  // Profile State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state from profile when it loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const getInitials = (
    name: string | null | undefined,
    email: string | undefined
  ) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "organizer":
        return "bg-primary-500/20 text-primary-400 border-primary-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  /**
   * Handle avatar file selection from AvatarUpload component
   */
  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      // Upload to server
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setAvatarUrl(data.url);

        // Update profile via API
        const updateResponse = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            avatar_url: data.url,
            full_name: fullName, // Preserve name
          }),
        });

        if (!updateResponse.ok)
          throw new Error("Failed to update profile via API");

        setProfileMessage({
          type: "success",
          text: "Avatar updated successfully!",
        });
      }
    } catch (error) {
      console.error(error);
      setProfileMessage({ type: "error", text: "Failed to upload avatar." });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setProfileMessage(null);

    try {
      // Update via API
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile via API");

      setProfileMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error(error);
      setProfileMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Tabs Navigation */}
        <div className="flex gap-4 border-b border-zinc-800 pb-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === "profile"
                ? "text-[#59DECA]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile & Security
            </div>
            {activeTab === "profile" && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#59DECA]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === "tickets"
                ? "text-[#59DECA]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              My Tickets
            </div>
            {activeTab === "tickets" && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#59DECA]" />
            )}
          </button>
        </div>

        {/* Tickets Tab */}
        {activeTab === "tickets" && user && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">My Tickets</CardTitle>
                <CardDescription className="text-zinc-400">
                  View and manage your event bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyTickets email={user.email || ""} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary-500" />
                  <div>
                    <CardTitle className="text-white">Profile</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Manage your profile information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <AvatarUpload
                    onFileSelect={handleAvatarUpload}
                    onRemove={() => setAvatarUrl("")}
                    previewUrl={avatarUrl}
                    uploading={uploading}
                    size="lg"
                  />
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-400">Profile Photo</p>
                    <p className="text-xs text-zinc-500">
                      Click to upload a new photo
                    </p>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-zinc-300">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary-500"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-zinc-800 border-zinc-700 text-zinc-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Role Badge */}
                <div className="space-y-2">
                  <Label className="text-zinc-300 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </Label>
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-sm uppercase ${getRoleBadgeColor(
                        profile?.role || "attendee"
                      )}`}
                    >
                      {profile?.role || "Attendee"}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Contact an administrator to change your role
                  </p>
                </div>

                {/* Message */}
                {profileMessage && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      profileMessage.type === "success"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {profileMessage.type === "success" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{profileMessage.text}</span>
                  </div>
                )}

                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">User ID</p>
                    <p className="text-zinc-300 font-mono text-xs truncate">
                      {user?.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Joined</p>
                    <p className="text-zinc-300">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
