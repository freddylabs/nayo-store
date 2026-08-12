"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { foodProducts } from "@/app/data/products";
import { Flame, ArrowRight } from "lucide-react";

export default function FoodSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const heroFood = foodProducts[0]; // Jollof & Fried Chicken

  return (
    <section
      id="food"
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A140D 0%, #0A0A0A 100%)" }}
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
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nayo-green-light/30 bg-nayo-green/10 text-[#4CAF50] text-xs tracking-widest uppercase font-semibold"
          >
            <Flame size={12} />
            Food • Chef's Collection
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-display text-4xl sm:text-5xl xl:text-6xl font-bold text-nayo-white"
          >
            Built for Every{" "}
            <span className="gold-text">Craving.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-nayo-white/50 max-w-lg mx-auto leading-relaxed"
          >
            Authentic West African flavours, elevated for the modern palate.
            Every dish is made to order — no shortcuts, no compromise.
          </motion.p>
        </div>


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
