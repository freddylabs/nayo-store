"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { cultureProducts } from "@/app/data/products";
import { ArrowRight } from "lucide-react";

const storyPoints = [
  {
    icon: "✦",
    title: "Artisan First",
    desc: "Every piece is made by hand, by craftspeople who have inherited their skill through generations.",
  },
  {
    icon: "◈",
    title: "Ethically Sourced",
    desc: "Direct partnerships with over 12 artisan collectives across Ghana, Nigeria, and Senegal.",
  },
  {
    icon: "❖",
    title: "Living Heritage",
    desc: "Adinkra symbols, kente weaves, and beadwork traditions alive in every object we curate.",
  },
];

export default function CultureSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="culture"
      ref={ref}
      className="relative overflow-hidden bg-nayo-white"
    >
      {/* Textured background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(212,175,55,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212,175,55,0.2) 0%, transparent 40%),
            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.15'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left: Text */}
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-nayo-gold text-xs tracking-[0.3em] uppercase font-semibold"
            >
              Culture • Heritage Collection
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-display text-4xl sm:text-5xl xl:text-6xl font-bold text-nayo-black leading-tight"
            >
              Objects That
              <br />
              <span className="gold-text">Remember.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-nayo-black/60 leading-relaxed max-w-md"
            >
              These are not souvenirs. They are living artefacts — each one
              carrying a story, a symbol, a place. Wear the culture. Pass it on.
            </motion.p>

            {/* Story Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="space-y-5 pt-2"
            >
              {storyPoints.map((pt) => (
                <div key={pt.title} className="flex items-start gap-4">
                  <span className="text-nayo-gold text-lg mt-0.5 flex-shrink-0 w-6 text-center">
                    {pt.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-nayo-black text-sm">{pt.title}</p>
                    <p className="text-nayo-black/50 text-xs mt-1 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="btn-outline flex items-center gap-2 px-7 py-3 text-xs tracking-widest uppercase font-medium w-fit"
            >
              Explore Heritage
              <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* Right: Featured images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative grid grid-cols-2 gap-4 h-[420px] sm:h-[500px]"
          >
            {/* Large left image */}
            <div className="relative rounded-2xl overflow-hidden border border-nayo-gold/15 row-span-2">
              <Image
                src="/culture-kente.png"
                alt="Kente handwoven garment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nayo-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs gold-text font-semibold tracking-widest uppercase">Kente Robe</p>
                <p className="text-[10px] text-nayo-white/70 mt-0.5">Ghana</p>
              </div>
            </div>

            {/* Top right */}
            <div className="relative rounded-2xl overflow-hidden border border-nayo-gold/15">
              <Image
                src="/hero-scrubs.png"
                alt="Heritage accessories"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nayo-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-xs gold-text font-semibold tracking-widest uppercase">Beadwork</p>
                <p className="text-[10px] text-nayo-white/70 mt-0.5">Nigeria</p>
              </div>
            </div>

            {/* Bottom right */}
            <div className="relative rounded-2xl overflow-hidden border border-nayo-gold/25 bg-nayo-white flex items-center justify-center p-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-display gold-text">12+</div>
                <p className="text-xs text-nayo-black/50 leading-tight">Artisan<br />Partners</p>
                <div className="w-8 h-px gold-gradient mx-auto" />
                <p className="text-[10px] text-nayo-gold tracking-widest uppercase">3 Countries</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
