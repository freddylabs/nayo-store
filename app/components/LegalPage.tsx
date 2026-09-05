import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="relative bg-nayo-green overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
          <div className="relative max-w-[800px] mx-auto px-6 sm:px-10 py-14 sm:py-16">
            <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
              Nayo Ltd.
            </p>
            <h1 className="text-display text-4xl sm:text-5xl font-bold text-white leading-tight mt-3">
              {title}
            </h1>
            <p className="mt-4 text-white/70 text-sm">Last updated {updated}</p>
          </div>
        </section>
        <article className="max-w-[800px] mx-auto px-6 sm:px-10 py-14 sm:py-16 space-y-10 text-nayo-black/75 leading-relaxed">
          {children}
        </article>
      </div>
      <Footer />
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-display text-2xl font-bold text-nayo-black">{title}</h2>
      <div className="space-y-3 text-sm sm:text-base">{children}</div>
    </section>
  );
}
