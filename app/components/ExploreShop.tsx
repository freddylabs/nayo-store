"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export const shops = [
  { label: "Apparel", href: "/fashion" },
  { label: "Foods", href: "/food" },
  { label: "Health", href: "/health" },
] as const;

export default function ExploreShop({
  variant = "pills",
  onNavigate,
}: {
  variant?: "pills" | "dropdown";
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  if (variant === "dropdown") {
    return (
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-gold text-xs tracking-widest uppercase px-5 py-2 font-bold inline-flex items-center gap-1.5"
          aria-expanded={open}
          aria-haspopup="true"
        >
          Explore Shop
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 min-w-[11rem] rounded-xl bg-nayo-white border border-nayo-gold/30 shadow-[0_16px_40px_rgba(0,0,0,0.18)] overflow-hidden z-[60]">
            {shops.map((shop) => (
              <Link
                key={shop.href}
                href={shop.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="block px-4 py-3 text-xs tracking-widest uppercase font-semibold text-nayo-black hover:bg-nayo-gold/15 hover:text-nayo-green"
              >
                {shop.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-nayo-black/45">
        Explore Shop
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {shops.map((shop) => (
          <Link
            key={shop.href}
            href={shop.href}
            onClick={onNavigate}
            className="btn-gold px-5 py-2.5 text-[10px] sm:text-xs tracking-widest uppercase font-bold"
          >
            {shop.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
