import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CheckoutClient from "@/app/checkout/CheckoutClient";
import { requireUser } from "@/app/lib/dal";

export const metadata: Metadata = {
  title: "Checkout — Nayo",
};

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");

  return (
    <main className="relative bg-nayo-black min-h-screen flex flex-col">
      <Navbar />
      <CheckoutClient
        defaultName={user.name}
        defaultEmail={user.email}
        defaultAddress={user.address ?? ""}
      />
      <Footer />
    </main>
  );
}
