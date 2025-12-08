"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useRef } from "react";
import supabase from "@/lib/supabase";
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
  Lock,
  Shield,
  Mail,
  Check,
  AlertCircle,
  Ticket,
  LayoutDashboard,
} from "lucide-react";
import MyTickets from "@/components/MyTickets";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile | tickets

  // Profile State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

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

  const handleChangePassword = async () => {
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
    } catch (error) {
      console.error(error);
      setPasswordMessage({ type: "error", text: "Failed to change password." });
    } finally {
      setChangingPassword(false);
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
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#59DECA]" />
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
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-zinc-800">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-zinc-800 text-white text-2xl">
                        {getInitials(fullName, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full text-black hover:bg-primary-400 transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-400">Profile Photo</p>
                    <p className="text-xs text-zinc-500">
                      Click the camera icon to upload a new photo
                    </p>
                    {uploading && (
                      <p className="text-xs text-primary-500">Uploading...</p>
                    )}
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

            {/* Password Section */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary-500" />
                  <div>
                    <CardTitle className="text-white">Password</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Change your password
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-zinc-300">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>

                {/* Message */}
                {passwordMessage && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      passwordMessage.type === "success"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {passwordMessage.type === "success" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{passwordMessage.text}</span>
                  </div>
                )}

                <Button
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword || !newPassword || !confirmPassword
                  }
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
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
