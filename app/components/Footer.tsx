"use client";

import Link from "next/link";
import { Phone, Mail, Clock, Truck } from "lucide-react";

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
  { label: "Apparel", href: "/fashion" },
  { label: "Food", href: "/food" },
  { label: "Health", href: "/health" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { icon: IconInstagram, label: "Instagram" },
  { icon: IconTwitter, label: "Twitter" },
  { icon: IconFacebook, label: "Facebook" },
  { icon: IconYoutube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-display text-3xl font-bold text-nayo-gold tracking-wide"
            >
              Nayo
            </Link>

            <p className="text-nayo-white/70 text-sm leading-relaxed max-w-xs">
              Live the NAYO Lifestyle. A brand of family, heritage, and
              entrepreneurship — where style meets flavor.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={`${label} (link coming soon)`}
                  title={`${label} — link coming soon`}
                  className="w-9 h-9 rounded-full border border-nayo-gold/40 flex items-center justify-center text-nayo-white hover:text-nayo-gold hover:border-nayo-gold transition-all duration-300"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs tracking-[0.25em] uppercase font-semibold text-nayo-gold">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-nayo-white/70 hover:text-nayo-gold transition-colors duration-300 text-left group flex items-center gap-2"
                  >
                    <span className="w-4 h-px bg-nayo-gold/0 group-hover:bg-nayo-gold/60 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs tracking-[0.25em] uppercase font-semibold text-nayo-gold flex items-center gap-2">
              <Clock size={13} />
              Working Hours and Days
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-nayo-white/80 leading-relaxed">
                Mondays, Fridays, and Saturdays
              </p>
              <p className="text-sm text-nayo-white/70">9:00 AM – 9:00 PM</p>
              <p className="text-xs text-nayo-gold/80 uppercase tracking-wider font-semibold flex items-center gap-2 pt-1">
                <Truck size={13} />
                Pickup and delivery only
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs tracking-[0.25em] uppercase font-semibold text-nayo-gold">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={12} className="text-nayo-black" />
                </div>
                <div>
                  <p className="text-[10px] text-nayo-gold uppercase tracking-wider mb-0.5 font-semibold">
                    Phone
                  </p>
                  <a
                    href="tel:+12403083183"
                    className="text-sm text-nayo-white/80 hover:text-nayo-gold transition-colors duration-300"
                  >
                    +1 (240) 308-3183
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={12} className="text-nayo-black" />
                </div>
                <div>
                  <p className="text-[10px] text-nayo-gold uppercase tracking-wider mb-0.5 font-semibold">
                    Email
                  </p>
                  <a
                    href="mailto:hello@nayo.store"
                    className="text-sm text-nayo-white/80 hover:text-nayo-gold transition-colors duration-300"
                  >
                    hello@nayo.store
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px divider-gold my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-nayo-white/50 text-center sm:text-left">
            © {new Date().getFullYear()} Nayo Ltd. All rights reserved.
          </p>
          <p className="text-xs text-nayo-gold italic text-display">
            Wear It. Taste It. Love It.
          </p>
          <div className="flex items-center gap-6 text-xs text-nayo-white/50">
            <Link href="/privacy" className="hover:text-nayo-gold/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-nayo-gold/60 transition-colors">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-nayo-gold/60 transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
