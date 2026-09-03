"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { User, LayoutDashboard, Package, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { logout } from "@/app/lib/auth-actions";

export default function AccountMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full glass-light border border-nayo-gold/20 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-nayo-gold/20 hover:border-nayo-gold/60 transition-all duration-300 text-xs tracking-widest uppercase text-nayo-white/80 hover:text-nayo-gold font-semibold"
      >
        <User size={16} />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: Package },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Account menu"
        className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-nayo-black text-xs font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300"
      >
        {initials || <User size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" as const }}
            className="absolute right-0 mt-3 w-60 rounded-2xl overflow-hidden glass border border-nayo-gold/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="px-5 py-4 border-b border-nayo-gold/10">
              <p className="text-sm font-semibold text-display text-nayo-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-nayo-white/40 truncate">{user.email}</p>
            </div>
            <div className="py-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-nayo-white/70 hover:text-nayo-gold hover:bg-nayo-gold/5 transition-colors"
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <form action={logout} className="border-t border-nayo-gold/10">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-nayo-white/60 hover:text-red-300 hover:bg-red-500/5 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
