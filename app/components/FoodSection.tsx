"use client";

import { Leaf, Plus } from "lucide-react";
import FoodOrderCard from "./FoodOrderCard";
import SectionClose from "./SectionClose";
import type { Product } from "@/app/data/products";
import { defaultCopy, type SiteCopy } from "@/app/lib/site-data";

export default function FoodSection({
  products,
  copy = defaultCopy,
}: {
  products: Product[];
  copy?: SiteCopy;
}) {
  return (
    <section id="food" className="relative bg-nayo-white">
      <div className="relative bg-nayo-green overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
            {copy.foodEyebrow}
          </p>
          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mt-3">
            {copy.foodTitle}
          </h1>
          <p className="mt-4 text-white/80 max-w-lg text-sm sm:text-base">
            {copy.foodIntro}
          </p>
        </div>
      </div>

      <div className="bg-[#F7F4EE] border-y border-nayo-green/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <Leaf size={18} className="text-nayo-green mb-3" />
            <h2 className="text-display text-xl font-bold text-nayo-black">
              {copy.foodBand1Title}
            </h2>
            <p className="mt-2 text-sm text-nayo-black/60 leading-relaxed">
              {copy.foodBand1Body}
            </p>
          </div>
          <div>
            <Plus size={18} className="text-nayo-green mb-3" />
            <h2 className="text-display text-xl font-bold text-nayo-black">
              {copy.foodBand2Title}
            </h2>
            <p className="mt-2 text-sm text-nayo-black/60 leading-relaxed">
              {copy.foodBand2Body}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="mb-10">
          <h2 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            {copy.foodCollectionTitle}
          </h2>
          <p className="mt-3 text-nayo-black/55 max-w-xl">
            {copy.foodCollectionBody}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <FoodOrderCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <SectionClose
        eyebrow="Nayo Foods"
        title={copy.foodCloseTitle}
        body={copy.foodCloseBody}
        href="/contact"
        cta="Order for a group"
      />
    </section>
  );
}
