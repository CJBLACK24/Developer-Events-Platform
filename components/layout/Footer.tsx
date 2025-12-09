"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Browse Events", href: "/events" },
    { label: "Create Event", href: "/events/create" },
    { label: "My Tickets", href: "/settings" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:contact@devevent.com", label: "Email" },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Only show footer on the home page
  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className="relative bg-black overflow-hidden pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Brand & Socials Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white">
                developer-events-platform.vercel.app
              </span>
            </Link>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:justify-items-end">
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Platform
              </h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Company
              </h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Legal
              </h3>
              <ul className="space-y-4 list-none p-0 m-0">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Text / Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900/50 mt-10">
          <p className="text-zinc-600 text-sm">
            © {currentYear} developer-events-platform.vercel.app. All rights
            reserved.
          </p>
          <p className="text-zinc-600 text-sm flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 text-zinc-600" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
