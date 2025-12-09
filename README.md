# DevEvent Platform

A modern, full-stack web application for developers to discover, host, and attend hackathons, meetups, and tech conferences. Built with **Next.js 16** and **React 19** using the App Router and Turbopack for blazing-fast performance, styled with **Tailwind CSS 4**, **Shadcn UI**, and **Framer Motion** for smooth animations and a premium glassmorphism aesthetic. The platform features interactive **WebGL spotlight effects** powered by OGL, secure **Supabase** authentication with role-based access control (Admin, Organizer, Attendee), **Cloudinary** integration for optimized image uploads, and **Nodemailer** for email notifications. Key features include a seamless event booking system with QR code ticket generation and PDF downloads, an admin dashboard for event management, user profile customization with avatar uploads, and a fully responsive design with a mobile-friendly sidebar navigation. Form handling is powered by **React Hook Form** with **Zod** validation, ensuring robust data integrity throughout the application.

## Tech Stack

| Category            | Technologies                                     |
| ------------------- | ------------------------------------------------ |
| **Framework**       | Next.js 16, React 19, TypeScript                 |
| **Database & Auth** | Supabase (PostgreSQL), Role-Based Access Control |
| **Styling**         | Tailwind CSS 4, Shadcn UI, Framer Motion         |
| **Media & Effects** | Cloudinary, OGL (WebGL), Canvas Confetti         |
| **Utilities**       | React Hook Form, Zod, QRCode, jsPDF, html2canvas |
| **Email**           | Nodemailer                                       |

## Getting Started

```bash
npm install
npm run dev
```

## License

MIT
