import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import CategoryHero from "@/app/components/CategoryHero";
import FoodSection from "@/app/components/FoodSection";
import { foodProducts } from "@/app/data/products";

export const metadata: Metadata = {
  title: "Food — Nayo",
};

export default function FoodPage() {
  return (
    <main className="relative bg-nayo-cream min-h-screen">
      <Navbar />
      <div className="pt-[116px]">
        <CategoryHero
          eyebrow="Food"
          title="The Chef's"
          highlight="Table"
          description="Authentic West African flavours, elevated for the modern palate and made fresh to order."
          image="/hero-food.png"
          count={`${foodProducts.length} dishes`}
        />
        <FoodSection showHeader={false} />
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
