"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ShopProductCard from "./ShopProductCard";
import type { Product } from "@/app/data/products";
import { defaultCopy, type SiteCopy } from "@/app/lib/site-data";

function ShopRow({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href: string;
}) {
  return (
    <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-nayo-black">
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-sm font-semibold text-nayo-green hover:text-nayo-gold transition-colors shrink-0"
        >
          View more
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible hide-scrollbar">
        {products.slice(0, 4).map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function ShopCollections({
  products,
  copy = defaultCopy,
}: {
  products: Product[];
  copy?: SiteCopy;
}) {
  const food = products.filter((item) => item.category === "food");
  const apparel = products.filter((item) => item.category === "fashion");
  const health = products.filter((item) => item.category === "health");

  return (
    <div className="bg-nayo-white pb-12 sm:pb-16 space-y-12 sm:space-y-16">
      <p className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-4 text-center text-[11px] tracking-[0.22em] uppercase font-semibold text-nayo-gold">
        {copy.shopEyebrow}
      </p>
      <ShopRow title={copy.shopFoodTitle} products={food} href="/food" />
      <ShopRow title={copy.shopApparelTitle} products={apparel} href="/fashion" />
      <ShopRow title={copy.shopHealthTitle} products={health} href="/health" />
    </div>
  );
}
