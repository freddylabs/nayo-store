"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ShopProductCard from "./ShopProductCard";
import {
  foodProducts,
  apparelProducts,
  healthProducts,
} from "@/app/data/products";
import type { Product } from "@/app/data/products";

function ShopRow({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
      <h2 className="text-xl sm:text-2xl font-bold text-nayo-black mb-5">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible hide-scrollbar">
        {products.slice(0, 5).map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function PromoBanner({
  eyebrow,
  headline,
  href,
  image,
  imageAlt,
}: {
  eyebrow: string;
  headline: string;
  href: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl bg-nayo-green min-h-[240px] sm:min-h-[280px]">
        <div className="relative min-h-[200px] lg:min-h-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="relative flex flex-col justify-center p-8 sm:p-12">
          <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold mb-3">
            {eyebrow}
          </p>
          <h3 className="text-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            {headline}
          </h3>
          <Link
            href={href}
            className="inline-flex items-center gap-1 mt-6 w-fit btn-gold px-6 py-3 text-xs tracking-widest uppercase font-bold"
          >
            View more
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ShopCollections() {
  return (
    <div className="bg-nayo-white pb-20 space-y-12 sm:space-y-16">
      <ShopRow title="Best Sellers" products={foodProducts} />

      <PromoBanner
        eyebrow="Nayo Foods"
        headline="Fresh meals, ready when you are."
        href="/food"
        image="/hero-food.png"
        imageAlt="Nayo Foods"
      />

      <ShopRow title="Newest in store" products={apparelProducts} />

      <PromoBanner
        eyebrow="Nayo Apparel"
        headline="Wear what speaks for you."
        href="/fashion"
        image="/hero-fashion.png"
        imageAlt="Nayo Apparel"
      />

      <ShopRow title="Latest collection" products={healthProducts} />

      <PromoBanner
        eyebrow="Nayo Health"
        headline="Uniforms made for every shift."
        href="/health"
        image="/hero-scrubs.png"
        imageAlt="Nayo Health"
      />
    </div>
  );
}
