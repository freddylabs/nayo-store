"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const stats = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "94%", label: "Repeat Purchase Rate" },
  { value: "3+", label: "Flagship Locations" },
  { value: "12+", label: "Artisan Partners" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="relative bg-nayo-charcoal overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px divider-gold" />

      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Text */}
          <div className="space-y-10">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold"
            >
              About Nayo
            </motion.p>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-nayo-white"
            >
              We Didn't Build a
              <br />
              <span className="gold-text">Brand. We Built</span>
              <br />
              a Culture.
            </motion.h2>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="space-y-5 text-nayo-white/60 leading-relaxed"
            >
              <p>
                NAYO was founded with a vision to create more than just a business—it was created to build a legacy. Rooted in strong family values and a passion for excellence, NAYO brings together two everyday essentials: quality fashion and great food under one trusted brand.
              </p>
              <p>
                We believe that what people wear and what they eat should reflect confidence, quality, and care. Every product and service we offer is designed to enrich lives, celebrate culture, and create meaningful experiences for our customers.
              </p>
              <p>
                As we grow, our commitment remains the same: to deliver exceptional products, outstanding service, and lasting value while making a positive impact in the communities we serve.
              </p>
            </motion.div>

          </div>

          {/* Right: Image + Stats */}
          <div className="relative">
            {/* Bleeding image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[480px] sm:h-[560px] lg:-mr-20 xl:-mr-32 rounded-2xl overflow-hidden border border-nayo-gold/20"
            >
              <Image
                src="/hero-fashion.png"
                alt="Nayo brand story — luxury fashion"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              {/* Gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-nayo-gold/10 via-transparent to-nayo-ink/40" />

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-6 left-6 right-6 glass rounded-xl p-5 border border-nayo-gold/20"
              >
                <p className="text-xs text-nayo-gold tracking-widest uppercase mb-3 font-semibold">
                  By the Numbers
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-display gold-text">
                        {stat.value}
                      </p>
                      <p className="text-xs text-nayo-white/50 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
