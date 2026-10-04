"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import type { OrderStatus } from "@/app/lib/site-data";

export const fieldClass =
  "w-full rounded-xl border border-nayo-black/10 bg-white px-3.5 py-2.5 text-sm text-nayo-black placeholder:text-nayo-black/35 outline-none transition focus:border-nayo-gold focus:ring-4 focus:ring-nayo-gold/15";

export const cardClass =
  "rounded-2xl border border-nayo-black/[0.06] bg-white shadow-[0_1px_2px_rgba(10,10,10,0.04),0_12px_32px_-18px_rgba(26,65,46,0.25)]";

export const statusMeta: Record<
  OrderStatus,
  { label: string; done: string; pill: string; dot: string }
> = {
  to_send: {
    label: "To fulfill",
    done: "To fulfill",
    pill: "text-[#A16207] bg-[#FDF4DC] border-[#F3DFA6]",
    dot: "bg-[#D4AF37]",
  },
  sent: {
    label: "With driver",
    done: "With driver",
    pill: "text-[#1D4ED8] bg-[#EAF1FE] border-[#C9DAFB]",
    dot: "bg-[#3B82F6]",
  },
  shipped: {
    label: "Shipped · UPS",
    done: "Shipped",
    pill: "text-[#6D28D9] bg-[#F2ECFE] border-[#DCCDFB]",
    dot: "bg-[#8B5CF6]",
  },
  delivered: {
    label: "Delivered",
    done: "Delivered",
    pill: "text-[#1A412E] bg-[#E6F2EA] border-[#BFDCC9]",
    dot: "bg-[#2D7A4F]",
  },
  picked_up: {
    label: "Picked up",
    done: "Picked up",
    pill: "text-[#1A412E] bg-[#E6F2EA] border-[#BFDCC9]",
    dot: "bg-[#2D7A4F]",
  },
};

export function money(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function compactMoney(value: number): string {
  if (value >= 10000) {
    return `$${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}k`;
  }
  return money(value);
}

export function timeAgo(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.round((now - then) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const avatarTones = [
  "bg-[#1A412E] text-[#F5C24D]",
  "bg-[#D4AF37] text-[#1A412E]",
  "bg-[#2D7A4F] text-white",
  "bg-[#F5E6C4] text-[#1A412E]",
  "bg-[#0A0A0A] text-[#D4AF37]",
];

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?";
  const tone =
    avatarTones[
      [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % avatarTones.length
    ];
  const dims = size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";
  return (
    <span
      className={`${dims} ${tone} shrink-0 rounded-full inline-flex items-center justify-center font-bold tracking-wide`}
    >
      {initials}
    </span>
  );
}

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-nayo-black/45 backdrop-blur-[2px]"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:rounded-l-3xl bg-[#FBF9F4] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-nayo-black/[0.06]">
          <div className="min-w-0">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-nayo-black/15 md:hidden" />
            <h2 className="text-display text-2xl font-bold text-nayo-black truncate">
              {title}
            </h2>
            {subtitle && <div className="mt-1 text-sm text-nayo-black/55">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mt-1 w-9 h-9 shrink-0 rounded-full border border-nayo-black/10 bg-white flex items-center justify-center text-nayo-black/60 hover:text-nayo-black"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="border-t border-nayo-black/[0.06] px-6 py-4 bg-white/70">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-nayo-gold/15 text-nayo-gold flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-display text-xl font-bold text-nayo-black">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-nayo-black/55">{body}</p>
    </div>
  );
}
