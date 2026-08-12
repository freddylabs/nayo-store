"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// Inline Instagram SVG (brand icons not in this lucide-react version)
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const galleryItems = [
  { src: "/hero-fashion.png", alt: "Nayo fashion editorial shoot", span: "col-span-1 row-span-2" },
  { src: "/hero-food.png", alt: "Nayo jollof rice", span: "col-span-1 row-span-1" },
  { src: "/hero-scrubs.png", alt: "Artisan beadwork", span: "col-span-1 row-span-1" },
  { src: "/culture-kente.png", alt: "Kente heritage garment", span: "col-span-1 row-span-2" },
  { src: "/food-suya.png", alt: "Suya skewers", span: "col-span-1 row-span-1" },
  { src: "/fashion-blazer.png", alt: "Nayo blazer editorial", span: "col-span-1 row-span-1" },
  { src: "/food-egusi.png", alt: "Egusi soup", span: "col-span-1 row-span-1" },
  { src: "/fashion-velvet.png", alt: "Velvet evening gown", span: "col-span-1 row-span-1" },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative bg-nayo-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px divider-gold" />

      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>

          </div>

          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="btn-gold flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-bold shrink-0 w-fit"
          >
            <IconInstagram />
            View on Instagram
          </motion.a>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                ease: "easeOut" as any,
                delay: 0.2 + i * 0.07,
              }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-nayo-black/0 group-hover:bg-nayo-black/40 transition-all duration-400">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                    <IconInstagram />
                  </div>
                </div>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-1 group-hover:ring-nayo-gold/40 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-10"
        >
          <p className="text-nayo-white/40 text-sm">
            Follow{" "}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nayo-gold hover:underline"
            >
              @nayo.official
            </a>{" "}
            for daily inspiration and behind-the-scenes.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
