import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/layout/LightRays";
import Navbar from "@/components/layout/Navbar";
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
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't Miss",
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

          <main className="pt-[80px] relative z-10">
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
