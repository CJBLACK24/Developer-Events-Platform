"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

/**
 * Avatar Upload Props
 * Specialized file upload component for profile/avatar images
 */
interface AvatarUploadProps {
  /** Callback when a file is selected */
  onFileSelect: (file: File) => void;
  /** Callback when the avatar is removed */
  onRemove?: () => void;
  /** Current preview URL (for controlled mode) */
  previewUrl?: string | null;
  /** Whether upload is in progress */
  uploading?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

/**
 * AvatarUpload Component
 * A circular drag-and-drop avatar upload with preview
 */
export function AvatarUpload({
  onFileSelect,
  onRemove,
  previewUrl,
  uploading = false,
  size = "md",
  className,
  disabled = false,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
    disabled: disabled || uploading,
    onDrop: handleFileChange,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          sizeClasses[size],
          "relative rounded-full overflow-hidden cursor-pointer transition-all duration-200",
          disabled && "opacity-50 cursor-not-allowed",
          isDragActive || isDragging
            ? "ring-2 ring-[#59DECA] ring-offset-2 ring-offset-[#0D161A]"
            : ""
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} />

        {previewUrl ? (
          // Preview state with image
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full"
          >
            <Image
              src={previewUrl}
              alt="Avatar preview"
              fill
              className="object-cover"
            />
            {/* Remove button */}
            {onRemove && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                aria-label="Remove avatar"
              >
                <X size={12} />
              </button>
            )}
            {/* Border overlay */}
            <div className="absolute inset-0 rounded-full border-2 border-[#59DECA] pointer-events-none" />
          </motion.div>
        ) : (
          // Empty state with upload icon
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              "w-full h-full bg-[#243B47] border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center",
              "group hover:border-[#59DECA] transition-colors rounded-full"
            )}
          >
            <Upload
              className={cn(
                "text-zinc-400 group-hover:text-[#59DECA] transition-colors",
                size === "sm"
                  ? "w-4 h-4"
                  : size === "lg"
                  ? "w-8 h-8"
                  : "w-6 h-6"
              )}
            />
            {size !== "sm" && (
              <span className="text-[10px] text-zinc-400 group-hover:text-white uppercase font-medium mt-1">
                Upload
              </span>
            )}
          </motion.div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
            <div className="w-6 h-6 border-2 border-[#59DECA] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Uploading text */}
      {uploading && (
        <span className="text-xs text-zinc-400 animate-pulse">
          Uploading...
        </span>
      )}
    </div>
  );
}

export default AvatarUpload;
