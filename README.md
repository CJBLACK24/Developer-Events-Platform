# DevEvent

A modern developer events platform built with Next.js 16, React 19, and Supabase.

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language  | TypeScript                         |
| Database  | Supabase (PostgreSQL)              |
| Auth      | Supabase Auth (Magic Link)         |
| Styling   | Tailwind CSS 4, Shadcn UI          |
| Media     | Cloudinary                         |
| Email     | Nodemailer                         |

## Features

- **Authentication** — Magic link sign-in/sign-up with email verification
- **Role-Based Access Control** — Admin, Organizer, and Attendee roles
- **Event Management** — Create, view, and book developer events
- **Organizer Dashboard** — Event creation restricted to verified organizers
- **Profile Management** — View/edit profile, change password
- **Responsive Design** — Mobile-first, enterprise-grade UI

## Project Structure

```
app/
├── (auth)/              # Auth pages (sign-in, sign-up, forgot-password)
├── api/                 # API routes (events, upload, auth callback)
├── auth/callback/       # Supabase auth callback handler
├── events/              # Event pages (detail, create)
├── profile/             # User profile page
└── page.tsx             # Home page

components/
├── providers/           # Context providers (AuthProvider)
├── ui/                  # Shadcn UI components
└── ...                  # Feature components

lib/
├── actions/             # Server actions (events, bookings)
├── mail/                # Email utilities (Nodemailer)
├── supabase.ts          # Supabase client
└── utils.ts             # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Cloudinary account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
SMTP_FROM=your_email
```

### Database Setup

Run the SQL scripts in your Supabase SQL Editor:

1. `supabase_schema.sql` — Events and bookings tables
2. `rbac_schema.sql` — Profiles, roles, and RLS policies

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Authentication Flow

```
Sign Up → Magic Link Email → Callback → Profile Created → Home
Sign In → Magic Link Email → Callback → Session Restored → Home
```

## Role Permissions

| Action            | Attendee | Organizer | Admin |
| ----------------- | -------- | --------- | ----- |
| View Events       | ✓        | ✓         | ✓     |
| Book Events       | ✓        | ✓         | ✓     |
| Create Events     | ✗        | ✓         | ✓     |
| Manage Own Events | ✗        | ✓         | ✓     |
| Approve Events    | ✗        | ✗         | ✓     |

## License

MIT
