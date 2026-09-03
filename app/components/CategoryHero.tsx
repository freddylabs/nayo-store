"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryHeroProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  image: string;
  count?: string;
}

export default function CategoryHero({
  eyebrow,
  title,
  highlight,
  description,
  image,
  count,
}: CategoryHeroProps) {
  return (
    <section className="relative h-[46vh] min-h-[360px] w-full overflow-hidden">
      <Image src={image} alt={title} fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-nayo-ink/90 via-nayo-ink/45 to-nayo-ink/30" />

      <div className="absolute inset-0 flex items-end">
        <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/60 mb-4">
              <Link href="/" className="hover:text-nayo-gold-bright transition-colors">Home</Link>
              <span>/</span>
              <span className="text-nayo-gold-bright">{eyebrow}</span>
            </div>

            <h1 className="text-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
              {title} {highlight && <span className="italic gold-text">{highlight}</span>}
            </h1>
            <p className="text-white/70 max-w-xl mt-4 leading-relaxed">{description}</p>
            {count && (
              <p className="text-[11px] tracking-[0.25em] uppercase text-white/50 mt-5">
                {count}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
