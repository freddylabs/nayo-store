import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import CartDrawer from "@/app/components/CartDrawer";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { requireUser } from "@/app/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard — Nayo",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Secure gate for every dashboard route.
  await requireUser("/dashboard");

  return (
    <main className="relative bg-nayo-black min-h-screen">
      <Navbar />
      <div className="pt-36 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          <DashboardSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <CartDrawer />
    </main>
  );
}
