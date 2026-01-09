import { z } from "zod";

// User Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Event Creation Schema
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Event date must be in the future",
  }),
  location: z.string().min(3, "Location is required"),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

// Profile Schema
export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(500, "Bio is too long").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  githubUsername: z.string().optional(),
  twitterHandle: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
