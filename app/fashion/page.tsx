import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import CategoryHero from "@/app/components/CategoryHero";
import FashionSection from "@/app/components/FashionSection";
import { fashionProducts } from "@/app/data/products";

export const metadata: Metadata = {
  title: "Fashion — Nayo",
};

export default function FashionPage() {
  return (
    <main className="relative bg-nayo-cream min-h-screen">
      <Navbar />
      <div className="pt-[116px]">
        <CategoryHero
          eyebrow="Fashion"
          title="The Apparel"
          highlight="Edit"
          description="Ready-to-wear, tailoring, and professional uniforms — crafted with intention and heritage-inspired detail."
          image="/hero-fashion.png"
          count={`${fashionProducts.length} pieces`}
        />
        <FashionSection showHeader={false} />
      </div>
      <Footer />
      <CartDrawer />
    </main>
  );
}
