import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/layout/LightRays";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import PageTransitionProvider from "@/components/providers/PageTransitionProvider";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevEvent | Developer Events Platform",
    template: "%s | DevEvent",
  },
  description:
    "The hub for every developer event you can't miss. Discover hackathons, meetups, and tech conferences all in one place.",
  keywords: [
    "developer events",
    "hackathons",
    "tech meetups",
    "conferences",
    "coding events",
    "developer community",
  ],
  authors: [{ name: "DevEvent Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevEvent",
    title: "DevEvent | Developer Events Platform",
    description: "Discover hackathons, meetups, and tech conferences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevEvent | Developer Events Platform",
    description: "Discover hackathons, meetups, and tech conferences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <Navbar />

          <div className="fixed inset-0 z-0 pointer-events-none">
            <LightRays
              raysOrigin="top-center"
              raysColor="#5dfeca"
              raysSpeed={1}
              lightSpread={2}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0.0}
              distortion={0.01}
              className="absolute inset-0"
            />
            <LightRays
              raysOrigin="top-center"
              raysColor="#5dfeca"
              raysSpeed={1}
              lightSpread={2}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0.0}
              distortion={0.01}
              className="absolute inset-0"
            />
          </div>

          <main className="pt-[80px] relative z-10 min-h-[calc(100vh-80px)]">
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
