# Developer Events Platform

A modern, full-stack platform for discovering and managing developer events, built with **Next.js 16** and **React 19**.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB (via Mongoose)
- **Analytics:** PostHog
- **Media:** Cloudinary

## 🛠️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   CLOUDINARY_URL=your_cloudinary_url
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## ✨ Features

- **Event Discovery:** Browse, search, and view detailed event information.
- **Dynamic Routing:** SEO-friendly pages for individual events and categories.
- **Booking System:** fast and secure signup flow for attendees.
- **Performance:** Optimized with Next.js caching and Server Actions.
