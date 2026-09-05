"use client";

import Link from "next/link";
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

export default function ShopCollections() {
  return (
    <div className="bg-nayo-white pb-20 space-y-12 sm:space-y-16">
      <ShopRow title="Best Sellers" products={foodProducts} href="/food" />
      <ShopRow
        title="Newest in store"
        products={apparelProducts}
        href="/fashion"
      />
      <ShopRow
        title="Latest collection"
        products={healthProducts}
        href="/health"
      />
    </div>
  );
}
