"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as any }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-nayo-black/80 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
          {/* Left Side: Mobile Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="lg:hidden p-2.5 rounded-full bg-nayo-white/5 border border-nayo-gold/30 hover:border-nayo-gold hover:bg-nayo-gold/10 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} className="text-nayo-gold" /> : <Menu size={22} className="text-nayo-gold" />}
            </button>
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 group flex items-center justify-center"
            >
              <Image
                src="/nayo-logo-transparent.png"
                alt="Nayo Logo"
                fill
                className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
          </div>

          {/* Center: All Links */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-nayo-white/70 hover:text-nayo-white tracking-widest uppercase transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px gold-gradient group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side: CTA & Cart */}
          <div className="flex items-center gap-4">
              <Link
                href="/fashion"
                className="hidden xl:block btn-gold text-xs tracking-widest uppercase px-5 py-2 font-bold text-center"
              >
                Shop
              </Link>

              <button
                id="cart-toggle-btn"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative p-2.5 rounded-full glass-light border border-nayo-gold/20 hover:border-nayo-gold/60 transition-all duration-300 group flex-shrink-0"
                aria-label="Open cart"
              >
                <ShoppingCart
                  size={20}
                  className="text-nayo-white/80 group-hover:text-nayo-gold transition-colors duration-300"
                />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient flex items-center justify-center text-[10px] font-bold text-nayo-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
            </button>

            <AccountMenu />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" as any }}
            className="fixed inset-0 z-40 glass flex flex-col pt-24 px-8 gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileNav}
                className="text-left text-2xl font-display text-nayo-white/80 hover:text-nayo-gold transition-colors duration-300 border-b border-nayo-gold/10 pb-4 block"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/fashion"
              onClick={handleMobileNav}
              className="btn-gold text-sm tracking-widest uppercase px-8 py-4 mt-4 font-bold text-center block"
            >
              Shop Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
