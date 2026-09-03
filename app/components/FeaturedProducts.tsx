"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { fashionProducts, foodProducts } from "@/app/data/products";

// A curated bestseller mix across both divisions.
const featured = [
  fashionProducts[0],
  foodProducts[0],
  fashionProducts[1],
  fashionProducts[4],
];

export default function FeaturedProducts() {
  return (
    <section className="bg-nayo-sand/50 border-y border-nayo-ink/8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow text-nayo-gold mb-3">Most Loved</p>
            <h2 className="text-display text-4xl sm:text-5xl font-bold text-nayo-ink leading-tight">
              This Season&apos;s <span className="italic gold-text">Bestsellers</span>
            </h2>
          </div>
          <Link
            href="/fashion"
            className="link-underline text-xs tracking-[0.2em] uppercase font-semibold text-nayo-ink hover:text-nayo-gold transition-colors inline-flex items-center gap-2 w-fit"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-nayo-ink/10"
        >
          {[
            { title: "Complimentary Shipping", copy: "On all orders over $200" },
            { title: "Made to Order", copy: "Freshly prepared, never mass-made" },
            { title: "Secure Checkout", copy: "Encrypted, protected payments" },
            { title: "Crafted in Lagos", copy: "Heritage in every detail" },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <p className="text-display text-base font-bold text-nayo-ink mb-1">
                {item.title}
              </p>
              <p className="text-xs text-nayo-ink/50 leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
