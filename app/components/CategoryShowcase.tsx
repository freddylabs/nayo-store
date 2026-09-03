"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    label: "Fashion",
    tagline: "Ready-to-wear & tailoring",
    href: "/fashion",
    image: "/hero-fashion.png",
    span: "lg:row-span-2",
  },
  {
    label: "Food",
    tagline: "Chef-made, delivered fresh",
    href: "/food",
    image: "/hero-food.png",
    span: "",
  },
  {
    label: "Workwear",
    tagline: "Uniforms & professional wear",
    href: "/fashion",
    image: "/hero-scrubs.png",
    span: "",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-nayo-cream">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow text-nayo-gold mb-3">Explore the House</p>
            <h2 className="text-display text-4xl sm:text-5xl font-bold text-nayo-ink leading-tight">
              Shop by <span className="italic gold-text">Category</span>
            </h2>
          </div>
          <p className="text-nayo-ink/50 text-sm max-w-xs sm:text-right leading-relaxed">
            One house, two passions — style you wear and flavour you savour.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-5 lg:auto-rows-[280px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cat.span}
            >
              <Link
                href={cat.href}
                className="group relative block w-full h-full min-h-[280px] rounded-2xl overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nayo-ink/80 via-nayo-ink/10 to-transparent" />
                <div className="absolute inset-0 p-7 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                        {cat.tagline}
                      </p>
                      <h3 className="text-display text-3xl font-bold text-white">
                        {cat.label}
                      </h3>
                    </div>
                    <span className="w-11 h-11 rounded-full bg-nayo-cream/95 flex items-center justify-center text-nayo-ink transition-all duration-300 group-hover:bg-nayo-gold-bright group-hover:rotate-45">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
