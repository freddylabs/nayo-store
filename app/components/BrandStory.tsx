"use client";

import { motion } from "framer-motion";
import { defaultCopy, type SiteCopy } from "@/app/lib/site-data";

export default function BrandStory({ copy = defaultCopy }: { copy?: SiteCopy }) {
  return (
    <section className="relative bg-nayo-green overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
      <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-nayo-gold text-xs tracking-[0.28em] uppercase font-semibold"
        >
          {copy.brandEyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 leading-tight"
        >
          {copy.brandTitle}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-8 mb-8 h-px w-24 bg-gradient-to-r from-transparent via-nayo-gold to-transparent"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/85 text-base sm:text-lg leading-relaxed"
        >
          {copy.brandBody}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-10 text-display italic text-2xl sm:text-3xl text-nayo-gold"
        >
          {copy.brandCloser}
        </motion.p>
      </div>
    </section>
  );
}
