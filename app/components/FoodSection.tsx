"use client";

import Image from "next/image";
import { Leaf, Plus } from "lucide-react";
import FoodOrderCard from "./FoodOrderCard";
import SectionClose from "./SectionClose";
import type { Product } from "@/app/data/products";
import { defaultCopy, type SiteCopy } from "@/app/lib/site-data";

const features = [
  {
    src: "/food-kenkey-platter.jpg",
    name: "Kenkey Combo Platter",
    note: "Fish, sausage, egg & plantain",
  },
  {
    src: "/hero-food.png",
    name: "Jollof and Beef",
    note: "The original plate",
  },
  {
    src: "/food-jollof-chicken.jpg",
    name: "Jollof and Chicken",
    note: "With fried plantain",
  },
  {
    src: "/food-jollof-goat.jpg",
    name: "Jollof with Goat Meat",
    note: "Plantain and salad",
  },
  {
    src: "/food-fried-rice.jpg",
    name: "Classic Fried Rice",
    note: "Fresh from the wok",
  },
];

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

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 pb-8">
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

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-16 pb-10 sm:pb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {features.map((item) => (
              <figure
                key={item.src}
                className="relative rounded-2xl overflow-hidden bg-nayo-green border border-white/10"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    quality={95}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nayo-green via-nayo-green/25 to-transparent" />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <p className="text-white text-sm font-medium leading-snug">
                    {item.name}
                  </p>
                  <p className="text-white/70 text-[11px] mt-0.5">{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
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
