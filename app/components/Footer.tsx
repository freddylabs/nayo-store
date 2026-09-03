"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const quickLinks = [
  { label: "Fashion", href: "/fashion" },
  { label: "Food", href: "/food" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const accountLinks = [
  { label: "My Account", href: "/dashboard" },
  { label: "My Orders", href: "/dashboard/orders" },
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/signup" },
];

const socials = [
  { icon: IconInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: IconTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: IconFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: IconYoutube, href: "https://youtube.com", label: "YouTube" },
];

const hours = [
  { days: "Mon – Fri", time: "10:00 AM – 9:00 PM" },
  { days: "Saturday", time: "9:00 AM – 10:00 PM" },
  { days: "Sunday", time: "11:00 AM – 7:00 PM" },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-nayo-onyx text-nayo-cream overflow-hidden">
      {/* Top gold hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-nayo-gold/50 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-6 lg:pr-8">
            <Link href="/" className="relative w-28 h-28 block group -ml-2">
              <Image
                src="/nayo-logo-transparent.png"
                alt="Nayo"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-nayo-cream/50 text-sm leading-relaxed max-w-xs">
              A luxury lifestyle house celebrating African heritage through fashion,
              food, and culture. Wear it. Taste it. Love it.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-nayo-cream/15 flex items-center justify-center text-nayo-cream/60 hover:text-nayo-onyx hover:bg-nayo-gold-bright hover:border-nayo-gold-bright transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-5">
            <h4 className="eyebrow text-nayo-gold-bright">Shop</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-nayo-cream/55 hover:text-nayo-gold-bright transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-5">
            <h4 className="eyebrow text-nayo-gold-bright">Account</h4>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-nayo-cream/55 hover:text-nayo-gold-bright transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + hours */}
          <div className="space-y-5">
            <h4 className="eyebrow text-nayo-gold-bright flex items-center gap-2">
              <Clock size={13} /> Visit Us
            </h4>
            <ul className="space-y-2.5">
              {hours.map((h) => (
                <li key={h.days} className="text-sm">
                  <span className="text-nayo-cream/40">{h.days}</span>
                  <span className="block text-nayo-cream/70">{h.time}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5 pt-2">
              <li className="flex items-start gap-2.5 text-sm text-nayo-cream/60">
                <Phone size={14} className="text-nayo-gold-bright mt-0.5 shrink-0" />
                <a href="tel:+2348001234567" className="hover:text-nayo-gold-bright transition-colors">+234 800 123 4567</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-nayo-cream/60">
                <Mail size={14} className="text-nayo-gold-bright mt-0.5 shrink-0" />
                <a href="mailto:hello@nayo.store" className="hover:text-nayo-gold-bright transition-colors">hello@nayo.store</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-nayo-cream/60">
                <MapPin size={14} className="text-nayo-gold-bright mt-0.5 shrink-0" />
                <span>14 Victoria Island Blvd, Lagos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-nayo-cream/10 my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-nayo-cream/35 text-center sm:text-left">
            © {new Date().getFullYear()} Nayo Lifestyle Ltd. All rights reserved.
          </p>
          <p className="text-sm text-nayo-cream/50 italic text-display">
            &ldquo;Wear It. Taste It. Love It.&rdquo;
          </p>
          <div className="flex items-center gap-6 text-xs text-nayo-cream/35">
            <a href="#" className="hover:text-nayo-gold-bright transition-colors">Privacy</a>
            <a href="#" className="hover:text-nayo-gold-bright transition-colors">Terms</a>
            <a href="#" className="hover:text-nayo-gold-bright transition-colors">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
