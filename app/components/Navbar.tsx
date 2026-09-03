"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Apparel", href: "/fashion" },
  { label: "Food", href: "/food" },
  { label: "Health", href: "/health" },
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

  const handleMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as any }}
        className={`fixed top-0 left-0 right-0 z-50 bg-nayo-green transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_rgba(10,10,10,0.25)]" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-[5.75rem] sm:h-[6.5rem] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              className="lg:hidden p-2 rounded-full border border-nayo-gold/50 hover:border-nayo-gold hover:bg-nayo-gold/10 transition-all duration-300"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} className="text-nayo-gold" /> : <Menu size={20} className="text-nayo-gold" />}
            </button>
            <Link
              href="/"
              className="relative h-[4.6rem] sm:h-[5.35rem] aspect-[527/585] shrink-0 group"
              aria-label="Nayo home"
            >
              <Image
                src="/Nayo_logo_nav.png"
                alt="Nayo Logo"
                fill
                className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-width: 640px) 74px, 86px"
                priority
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-nayo-white/85 hover:text-nayo-gold tracking-widest uppercase transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px gold-gradient group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/fashion"
                className="hidden xl:block btn-gold text-xs tracking-widest uppercase px-5 py-2 font-bold text-center"
              >
                Shop
              </Link>

              <button
                id="cart-toggle-btn"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative p-2.5 rounded-full border border-nayo-gold/50 hover:border-nayo-gold hover:bg-nayo-gold/10 transition-all duration-300 group flex-shrink-0"
                aria-label="Open cart"
              >
                <ShoppingCart
                  size={20}
                  className="text-nayo-white group-hover:text-nayo-gold transition-colors duration-300"
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
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" as any }}
            className="fixed inset-0 z-40 bg-nayo-green flex flex-col pt-[6.5rem] px-8 gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleMobileNav}
                className="text-left text-2xl font-display text-nayo-white/90 hover:text-nayo-gold transition-colors duration-300 border-b border-nayo-gold/20 pb-4 block"
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
