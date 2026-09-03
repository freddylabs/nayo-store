"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { logout } from "@/app/lib/auth-actions";

const links = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Orders", href: "/dashboard/orders", icon: Package, exact: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, exact: true },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="lg:sticky lg:top-28">
      <nav className="glass rounded-2xl border border-nayo-gold/15 p-3 flex lg:flex-col gap-1 overflow-x-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                active
                  ? "gold-gradient text-nayo-black font-bold"
                  : "text-nayo-white/60 hover:text-nayo-gold hover:bg-nayo-gold/5"
              }`}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}

        <div className="hidden lg:block h-px divider-gold my-2" />

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-nayo-white/60 hover:text-nayo-gold hover:bg-nayo-gold/5 transition-all duration-300 whitespace-nowrap"
        >
          <Home size={17} />
          Back to Store
        </Link>

        <form action={logout} className="contents">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-nayo-white/60 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 whitespace-nowrap w-full"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </form>
      </nav>
    </aside>
  );
}
