<div align="center">

# ✨ *Dev*Event Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://developer-events-platform.vercel.app)

**The Hub for Every Developer Event You Can't Miss** 🚀

_Hackathons • Meetups • Tech Conferences — All in One Place_

[🌐 Live Demo](https://developer-events-platform.vercel.app) · [📋 Report Bug](https://github.com/CJBLACK24/Developer-Events-Platform/issues) · [✨ Request Feature](https://github.com/CJBLACK24/Developer-Events-Platform/issues)

</div>

---

## 📖 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [✨ About The Project](#-about-the-project)
- [🎯 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📊 Database Schema](#-database-schema)
- [🔒 Security Features](#-security-features)
- [📱 API Endpoints](#-api-endpoints)
- [🎨 UI Components](#-ui-components)
- [📄 License](#-license)

</details>

---

## ✨ About The Project

**DevEvent** is a modern, full-stack web application designed for developers to **discover**, **host**, and **attend** tech events. Built with the latest technologies including **Next.js 16**, **React 19**, and **Turbopack** for blazing-fast performance.

### 🌟 What Makes DevEvent Special?

| Feature                    | Description                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 🎨 **Premium Aesthetic**   | Dark mode with glassmorphism effects, smooth Framer Motion animations, and interactive WebGL spotlight effects powered by OGL |
| 🔐 **Enterprise Security** | Arcjet-powered protection with bot detection, rate limiting, and shield defense mechanisms                                    |
| 📧 **Automated Emails**    | Beautiful HTML email templates for booking confirmations and cancellations via Nodemailer                                     |
| 🎫 **Digital Tickets**     | QR code generation, PDF ticket downloads with html2canvas & jsPDF, and confetti celebrations                                  |
| 👥 **Role-Based Access**   | Admin, Organizer, and Attendee roles with middleware-enforced permissions                                                     |

---

## 🎯 Key Features

<details open>
<summary><strong>🔍 Event Discovery</strong></summary>

- Advanced search with real-time filtering
- Filter by mode: `Virtual` | `Hybrid` | `In-Person`
- Tag-based filtering with badge pills
- Paginated event listings (9 per page)
- Animated event cards with hover effects

</details>

<details>
<summary><strong>🎫 Smart Booking System</strong></summary>

- Multi-step booking wizard with form validation (Zod + React Hook Form)
- Avatar upload with preview (Cloudinary integration)
- Capacity management with "Sold Out" status
- Unique ticket code generation (`DEV-XXXX-XXXX`)
- Local storage for offline ticket access

</details>

<details>
<summary><strong>📊 User Dashboard</strong></summary>

- View all booked events with ticket details
- One-click ticket cancellation with email confirmation
- Download PDF tickets with QR codes
- Profile customization with avatar uploads
- Account settings management

</details>

<details>
<summary><strong>👨‍💼 Admin & Organizer Panel</strong></summary>

- Comprehensive dashboard with event statistics
- Event approval workflow for moderation
- Create events with rich text description and image upload
- Attendee tracking and management
- Delete/Edit event capabilities

</details>

<details>
<summary><strong>🔒 Security & Performance</strong></summary>

- **Arcjet Shield**: DDoS and attack protection
- **Bot Detection**: Blocks malicious automated traffic
- **Rate Limiting**: Token bucket algorithm (100 req/min general, 10 req/min auth)
- **Middleware RBAC**: Server-side role verification
- **Row Level Security**: Supabase RLS policies

</details>

<details>
<summary><strong>📈 SEO & Analytics</strong></summary>

- Dynamic sitemap generation (`/sitemap.xml`)
- Robots.txt configuration
- Open Graph metadata
- Vercel Analytics integration

</details>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="150">

### 🎨 Frontend

</td>
<td>

| Technology    | Version | Purpose                         |
| ------------- | ------- | ------------------------------- |
| Next.js       | 16.x    | React framework with App Router |
| React         | 19.x    | UI library                      |
| TypeScript    | 5.x     | Type safety                     |
| Tailwind CSS  | 4.x     | Utility-first styling           |
| Framer Motion | 12.x    | Animation library               |
| OGL           | 1.x     | WebGL effects                   |

</td>
</tr>
<tr>
<td align="center">

### 🔧 Backend

</td>
<td>

| Technology | Purpose                                      |
| ---------- | -------------------------------------------- |
| Supabase   | PostgreSQL Database + Auth                   |
| Arcjet     | Security (Shield, Rate Limit, Bot Detection) |
| Nodemailer | Email service                                |
| Cloudinary | Image hosting & optimization                 |

</td>
</tr>
<tr>
<td align="center">

### 🧩 UI Components

</td>
<td>

| Library      | Used For              |
| ------------ | --------------------- |
| Shadcn/ui    | Base component system |
| Radix UI     | Accessible primitives |
| Lucide React | Icon library          |
| Tabler Icons | Additional icons      |

</td>
</tr>
<tr>
<td align="center">

### 🛠️ Utilities

</td>
<td>

| Library                | Purpose              |
| ---------------------- | -------------------- |
| React Hook Form        | Form handling        |
| Zod                    | Schema validation    |
| QRCode / react-qr-code | Ticket QR generation |
| jsPDF + html2canvas    | PDF ticket export    |
| Canvas Confetti        | Celebration effects  |
| UUID                   | Unique ID generation |

</td>
</tr>
</table>

---

## 📁 Project Structure

```
developer-events-platform/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 (auth)/                   # Auth routes (sign-in, sign-up)
│   ├── 📂 admin/                    # Admin dashboard
│   ├── 📂 api/                      # API routes
│   │   ├── 📂 admin/                # Admin endpoints
│   │   ├── 📂 events/               # Event CRUD
│   │   ├── 📂 profile/              # User profile
│   │   └── 📂 upload/               # Cloudinary upload
│   ├── 📂 auth/                     # Auth callbacks
│   ├── 📂 events/                   # Event pages
│   │   ├── 📂 [slug]/               # Dynamic event detail
│   │   └── 📂 create/               # Event creation
│   ├── 📂 profile/                  # User profile page
│   ├── 📂 settings/                 # User settings & tickets
│   ├── 📄 layout.tsx                # Root layout with navbar/footer
│   ├── 📄 page.tsx                  # Home page with hero
│   ├── 📄 sitemap.ts                # Dynamic SEO sitemap
│   └── 📄 robots.ts                 # SEO robots.txt
│
├── 📂 components/
│   ├── 📂 booking/                  # Booking wizard, ticket display
│   ├── 📂 events/                   # Event cards, detail views
│   ├── 📂 layout/                   # Navbar, Footer, LightRays effect
│   ├── 📂 providers/                # Context providers
│   ├── 📂 shared/                   # Shared components
│   └── 📂 ui/                       # Shadcn UI components
│
├── 📂 lib/
│   ├── 📂 actions/                  # Server actions
│   ├── 📂 mail/                     # Email templates
│   ├── 📄 arcjet.ts                 # Security configuration
│   ├── 📄 constants.ts              # App constants
│   ├── 📄 supabase.ts               # Supabase client
│   └── 📄 utils.ts                  # Utility functions
│
├── 📄 middleware.ts                 # Auth & RBAC middleware
├── 📄 supabase_schema.sql           # Database schema
└── 📄 rbac_schema.sql               # RBAC policies
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
node >= 18.x
npm >= 9.x

# Accounts needed
- Supabase project
- Cloudinary account
- Arcjet account (optional but recommended)
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/CJBLACK24/Developer-Events-Platform.git

# 2. Navigate to project
cd Developer-Events-Platform

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 5. Run database migrations
# Execute supabase_schema.sql and rbac_schema.sql in Supabase SQL Editor

# 6. Start development server with Turbopack
npm run dev
```

### Available Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start dev server with Turbopack 🚀 |
| `npm run build` | Build for production               |
| `npm start`     | Start production server            |
| `npm run lint`  | Run ESLint                         |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Arcjet (Security)
ARCJET_KEY=your_arcjet_key

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📊 Database Schema

### Primary Tables

```sql
-- Events Table
┌─────────────────────────────────────────────────┐
│ events                                          │
├─────────────────────────────────────────────────┤
│ id           │ BIGINT PRIMARY KEY               │
│ title        │ TEXT NOT NULL                    │
│ slug         │ TEXT UNIQUE NOT NULL             │
│ description  │ TEXT NOT NULL                    │
│ overview     │ TEXT NOT NULL                    │
│ image        │ TEXT NOT NULL                    │
│ venue        │ TEXT NOT NULL                    │
│ location     │ TEXT NOT NULL                    │
│ date         │ DATE NOT NULL                    │
│ time         │ TIME NOT NULL                    │
│ mode         │ TEXT ('online'|'offline'|'hybrid')│
│ audience     │ TEXT NOT NULL                    │
│ agenda       │ TEXT[] DEFAULT '{}'              │
│ organizer    │ TEXT NOT NULL                    │
│ tags         │ TEXT[] DEFAULT '{}'              │
│ organizer_id │ UUID REFERENCES auth.users       │
│ is_approved  │ BOOLEAN DEFAULT FALSE            │
│ created_at   │ TIMESTAMPTZ DEFAULT NOW()        │
└─────────────────────────────────────────────────┘

-- Bookings Table
┌─────────────────────────────────────────────────┐
│ bookings                                        │
├─────────────────────────────────────────────────┤
│ id           │ BIGINT PRIMARY KEY               │
│ event_id     │ BIGINT REFERENCES events(id)     │
│ email        │ TEXT NOT NULL                    │
│ created_at   │ TIMESTAMPTZ DEFAULT NOW()        │
│ UNIQUE(event_id, email)                         │
└─────────────────────────────────────────────────┘

-- User Profiles (RBAC)
┌─────────────────────────────────────────────────┐
│ profiles                                        │
├─────────────────────────────────────────────────┤
│ id           │ UUID PRIMARY KEY                 │
│ email        │ TEXT                             │
│ role         │ user_role ('admin'|'organizer'|'attendee')│
│ full_name    │ TEXT                             │
│ avatar_url   │ TEXT                             │
│ created_at   │ TIMESTAMPTZ DEFAULT NOW()        │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Security Features

### Arcjet Protection Layers

```typescript
// Rate Limiting Configuration
┌────────────────────────────────────────────┐
│ Endpoint Type    │ Limit          │ Window │
├────────────────────────────────────────────┤
│ General API      │ 100 requests   │ 60s    │
│ Authentication   │ 10 requests    │ 60s    │
│ File Upload      │ 20 requests    │ 60s    │
│ Booking          │ 30 requests    │ 60s    │
└────────────────────────────────────────────┘
```

### Middleware Route Protection

```typescript
// Protected Routes (requires authentication)
/settings
/events/create

// Admin Only Routes
/admin/*

// Organizer + Admin Routes
/events/create
```

---

## 📱 API Endpoints

| Method   | Endpoint                 | Description                | Auth         |
| -------- | ------------------------ | -------------------------- | ------------ |
| `GET`    | `/api/events`            | List all approved events   | ❌           |
| `GET`    | `/api/events/[id]`       | Get event details          | ❌           |
| `POST`   | `/api/events`            | Create new event           | ✅ Organizer |
| `GET`    | `/api/admin`             | Admin dashboard data       | ✅ Admin     |
| `POST`   | `/api/admin/approve`     | Approve event              | ✅ Admin     |
| `DELETE` | `/api/admin/events/[id]` | Delete event               | ✅ Admin     |
| `GET`    | `/api/profile`           | Get user profile           | ✅           |
| `PATCH`  | `/api/profile`           | Update profile             | ✅           |
| `POST`   | `/api/upload`            | Upload image to Cloudinary | ✅           |

---

## 🎨 UI Components

### Component Library (`/components/ui/`)

| Component  | Description                              |
| ---------- | ---------------------------------------- |
| `Button`   | Primary action buttons with variants     |
| `Card`     | Event display cards with glassmorphism   |
| `Dialog`   | Modal dialogs (booking, success, delete) |
| `Form`     | React Hook Form integration              |
| `Select`   | Custom styled dropdowns                  |
| `Tabs`     | Tabbed navigation for settings           |
| `Avatar`   | User profile pictures                    |
| `Badge`    | Tag pills for event categories           |
| `Skeleton` | Loading state placeholders               |
| `Table`    | Admin data tables                        |

### Custom Components

| Component       | Location    | Purpose                              |
| --------------- | ----------- | ------------------------------------ |
| `BookingWizard` | `/booking/` | Multi-step event registration        |
| `TicketDisplay` | `/booking/` | QR code ticket view                  |
| `EventCard`     | `/events/`  | Event listing cards                  |
| `LightRays`     | `/layout/`  | WebGL animated background            |
| `Navbar`        | `/layout/`  | Responsive navigation with user menu |
| `Footer`        | `/layout/`  | Site-wide footer                     |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

### Built with ❤️ by Developer Community

[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/CJBLACK24)
[![Live Demo](https://img.shields.io/badge/Live-Demo-59DECA?style=for-the-badge&logo=vercel)](https://developer-events-platform.vercel.app)

**⭐ Star this repo if you find it useful!**

</div>
