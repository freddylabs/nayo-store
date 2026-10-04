"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/account/login", { method: "DELETE" });
        router.refresh();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80 hover:border-nayo-gold hover:text-nayo-gold"
    >
      <LogOut size={14} /> Sign out
    </button>
  );
}
