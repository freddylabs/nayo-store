"use client";

import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ExploreShop from "@/app/components/ExploreShop";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutSuccessPage() {
  const { dispatch } = useCart();

  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-36 pb-24 px-6 max-w-xl mx-auto text-center">
        <ShoppingCart size={40} className="mx-auto text-nayo-gold mb-4" />
        <h1 className="text-display text-4xl font-bold text-nayo-black mb-3">
          Order confirmed
        </h1>
        <p className="text-nayo-black/55 mb-8">
          Thank you. Your payment went through and we’ll be in touch with next
          steps for pickup or delivery.
        </p>
        <ExploreShop />
      </div>
      <Footer />
    </main>
  );
}
