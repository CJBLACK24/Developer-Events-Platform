# DevEvent Platform

A modern, full-stack web application for developers to discover, host, and attend hackathons, meetups, and tech conferences. Built with **Next.js 16** and **React 19** using the App Router and Turbopack for blazing-fast performance, styled with **Tailwind CSS 4**, **Shadcn UI**, and **Framer Motion** for smooth animations and a premium glassmorphism aesthetic. The platform features interactive **WebGL spotlight effects** powered by OGL, secure **Supabase** authentication with role-based access control (RBAC), and **Arcjet** for advanced security (bot protection, rate limiting).

## Key Features

- **Event Discovery**: Advanced search, filtering by mode (virtual/hybrid/in-person) & tags, and pagination.
- **Secure Booking**: Seamless booking flow with capacity management, "Sold Out" status, and QR code ticket generation.
- **User Dashboard**: Manage bookings, cancel tickets with email confirmation, and customize profiles.
- **Admin & Organizer Tools**: Comprehensive dashboard for event management, image uploads via **Cloudinary**, and attendee tracking.
- **Security & Performance**: **Arcjet** shield protection, server-side role verification, global error handling, and SEO optimization (Sitemap, Robots.txt, Metadata).
- **Design**: Responsive layout, dark mode aesthetic, and interactive micro-animations.

## Tech Stack

| Category            | Technologies                                            |
| ------------------- | ------------------------------------------------------- |
| **Framework**       | Next.js 16, React 19, TypeScript                        |
| **Database & Auth** | Supabase (PostgreSQL), Middleware RBAC                  |
| **Styling**         | Tailwind CSS 4, Shadcn UI, Framer Motion                |
| **Security**        | **Arcjet** (Bot Detection, Rate Limiting, Shield), Zod  |
| **Media & Effects** | Cloudinary, OGL (WebGL), Canvas Confetti                |
| **Utilities**       | React Hook Form, Nodemailer, QRCode, jsPDF, html2canvas |

## Getting Started

1. Clone the repository
2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables (Supabase, Cloudinary, Arcjet)
4. Run the development server:

    ```bash
    npm run dev
    ```

## License

MIT
