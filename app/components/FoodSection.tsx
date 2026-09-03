"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { foodProducts } from "@/app/data/products";
import { Flame } from "lucide-react";

export default function FoodSection({ showHeader = true }: { showHeader?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="food"
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EEF4EE 0%, #F7F4EE 100%)" }}
    >
      {/* Warm amber glow */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(46,90,65,0.6), transparent)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(31,61,45,0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nayo-green-light/30 bg-nayo-green/10 text-nayo-green-light text-xs tracking-widest uppercase font-semibold"
            >
              <Flame size={12} />
              Food • Chef&apos;s Collection
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-display text-4xl sm:text-5xl xl:text-6xl font-bold text-nayo-ink"
            >
              Built for Every{" "}
              <span className="italic gold-text">Craving.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-nayo-ink/50 max-w-lg mx-auto leading-relaxed"
            >
              Authentic West African flavours, elevated for the modern palate.
              Every dish is made to order — no shortcuts, no compromise.
            </motion.p>
          </div>
        )}


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {foodProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
