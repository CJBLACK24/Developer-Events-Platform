# DevEvent Platform

A premium, meaningful platform for developers to discover, host, and attend hackathons, meetups, and conferences. Built with modern web technologies focusing on performance, security, and a stunning user experience.

## 🚀 Tech Stack

| Layer         | Technology                                                           |
| ------------- | -------------------------------------------------------------------- |
| **Framework** | **Next.js 15+** (App Router, Server Actions)                         |
| **Language**  | **TypeScript**                                                       |
| **Database**  | **Supabase** (PostgreSQL)                                            |
| **Auth**      | **Supabase Auth** (Magic Link & Secure Session)                      |
| **Styling**   | **Tailwind CSS 4**, **Shadcn UI**, **OGL** (WebGL spotlight effects) |
| **Media**     | **Cloudinary** (Optimized Image Delivery)                            |
| **Email**     | **Nodemailer**                                                       |

## ✨ Key Features

### 🎨 Premium UI/UX

- **Spotlight Effects**: Interactive WebGL light rays that track mouse movement (`OGL`).
- **Glassmorphism**: Modern, translucent UI elements with blur effects.
- **Clean Aesthetics**: Hidden scrollbars and smooth transitions for a polished feel.
- **Responsive**: Fully optimized for all device sizes.

### 🛡️ Authentication & Security

- **Secure Role-Based Access Control (RBAC)**: Distinct permissions for Admins, Organizers, and Attendees.
- **Server-Side Verification**: Critical operations (Event Creation, Profile Updates) are handled via secure server-side API routes using the **Supabase Service Role Key** to bypass client-side risks.
- **Secure Logout**: Robust session clearing mechanisms.

### 📅 Event Management

- **Robust Creation Flow**: Two-step creation process (Image Upload -> Data persist) with granular status feedback to prevent "hanging" states.
- **Admin Dashboard**: Comprehensive view for admins to manage events with enhanced table UI.
- **Booking System**: Seamless event registration for attendees.

### 👤 Profile System

- **Avatar Uploads**: Integrated with Cloudinary for fast, secure profile picture management.
- **Profile Updates**: Secure server-side routes ensuring user data integrity.

## 🛠️ Project Structure

```
app/
├── (auth)/              # Sign-in, Sign-up, Password Reset
├── admin/               # Admin Dashboard (Protected)
├── api/                 # Secure Server API Routes
│   ├── admin/           # Admin-only operations
│   ├── events/          # Secure event creation/fetching
│   ├── profile/         # Secure profile updates
│   ├── upload/          # Cloudinary image upload handler
│   └── seed/            # Database seeding utilities
├── events/              # Event browsing and creation pages
├── settings/            # User profile settings
└── layout.tsx           # Global layout with LightRays effect
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- Supabase Project
- Cloudinary Account

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" # CRITICAL for server-side ops

# Media (Cloudinary)
CLOUDINARY_URL="cloudinary://..."

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email"
```

### 3. Installation & Run

```bash
npm install
npm run dev
```

## 🔄 Logic Flows

### Event Creation Pipeline

1. **User Form**: User inputs title, date, time, and uploads image.
2. **Image Upload**: Image is sent to `/api/upload` (Cloudinary). Returns secure URL.
3. **Submission**: Form data + Image URL sent to `/api/events`.
4. **Validation**: Server verifies data and uses `Service Role` to insert into Supabase `events` table.
5. **Feedback**: User receives granular status ("Uploading...", "Saving...") and success confirmation.

### Profile Update Pipeline

1. **User Action**: User updates avatar or name in Settings.
2. **Secure Request**: Data sent to `/api/profile`.
3. **Server Update**: Route uses `Service Role` to securely update the `profiles` table and Auth metadata, bypassing strictly restricted client RLS policies for robustness.

## 📝 License

MIT
