"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import AccountMenu from "@/app/components/AccountMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Fashion", href: "/fashion" },
  { label: "Food", href: "/food" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { totalItems, dispatch } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileNav = () => setMobileOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Announcement bar */}
        <div className="bg-nayo-green text-nayo-cream">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-9 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium">
            <span className="hidden sm:inline text-nayo-cream/70">Complimentary shipping over $200</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-nayo-gold-bright" />
            <span className="text-nayo-gold-bright">Wear It. Taste It. Love It.</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-nayo-gold-bright" />
            <span className="hidden sm:inline text-nayo-cream/70">Crafted in Lagos</span>
          </div>
        </div>

        {/* Main nav */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className={`transition-all duration-300 border-b ${
            scrolled
              ? "bg-nayo-cream/90 backdrop-blur-lg border-nayo-ink/10 shadow-[0_10px_30px_-15px_rgba(20,18,12,0.25)]"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
            {/* Left: Mobile menu & logo */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 lg:flex-none">
              <button
                className="lg:hidden p-2.5 rounded-full border border-nayo-ink/15 hover:border-nayo-gold hover:bg-nayo-gold/10 transition-all duration-300"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} className="text-nayo-ink" /> : <Menu size={20} className="text-nayo-ink" />}
              </button>
              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 group flex items-center justify-center"
              >
                <Image
                  src="/nayo-logo-transparent.png"
                  alt="Nayo"
                  fill
                  className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>

            {/* Center: Links */}
            <nav className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-underline text-[12px] font-medium text-nayo-ink/70 hover:text-nayo-ink tracking-[0.2em] uppercase transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: CTA, cart, account */}
            <div className="flex items-center gap-3 sm:gap-4 justify-end flex-1 lg:flex-none">
              <Link
                href="/fashion"
                className="hidden xl:inline-flex btn-dark text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 items-center"
              >
                Shop
              </Link>

              <button
                id="cart-toggle-btn"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative p-2.5 rounded-full border border-nayo-ink/15 hover:border-nayo-gold/60 hover:bg-nayo-gold/5 transition-all duration-300 group flex-shrink-0"
                aria-label="Open cart"
              >
                <ShoppingBag
                  size={19}
                  className="text-nayo-ink/80 group-hover:text-nayo-gold transition-colors duration-300"
                />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient flex items-center justify-center text-[10px] font-bold text-nayo-ink"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <AccountMenu />
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className="fixed inset-0 z-40 bg-nayo-cream flex flex-col pt-32 px-8 gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileNav}
                className="text-left text-3xl font-display text-nayo-ink hover:text-nayo-gold transition-colors duration-300 border-b border-nayo-ink/10 pb-4 block"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/fashion"
              onClick={handleMobileNav}
              className="btn-dark text-sm tracking-widest uppercase px-8 py-4 mt-4 font-semibold text-center block"
            >
              Shop Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
