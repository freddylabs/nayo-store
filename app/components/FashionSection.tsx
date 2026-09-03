"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { fashionProducts } from "@/app/data/products";

export default function FashionSection({ showHeader = true }: { showHeader?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="fashion" ref={ref} className="relative bg-nayo-black overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,175,55,0.5) 2px, rgba(212,175,55,0.5) 3px)",
          backgroundSize: "100% 40px",
        }}
      />

      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <p className="eyebrow text-nayo-gold mb-3">The Collection</p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-display text-4xl sm:text-5xl xl:text-6xl font-bold text-nayo-ink leading-tight"
              >
                Wear What
                <br />
                <span className="italic gold-text">Speaks For You.</span>
              </motion.h2>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fashionProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
