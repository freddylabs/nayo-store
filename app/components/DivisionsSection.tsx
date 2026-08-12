"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] },
});

export default function DivisionsSection() {
  return (
    <section className="relative bg-nayo-black py-16 sm:py-20 overflow-hidden border-t border-nayo-white/5">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-nayo-white"
          >
            Explore Our <span className="gold-text italic">Divisions</span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="text-nayo-white/60 text-base sm:text-lg leading-relaxed"
          >
            A unified legacy of uncompromising excellence across style and taste.
          </motion.p>
        </div>

        <div className="flex flex-col gap-10 sm:gap-16 w-full">
          
          {/* NAYO FOODS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-nayo-green/30 w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,30,22,0.9) 0%, rgba(10,20,15,0.95) 100%)",
            }}
          >
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-0">
              {/* Text side */}
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 lg:pr-8">
                <h3 className="text-display text-3xl sm:text-4xl xl:text-5xl font-bold text-nayo-white leading-tight">
                  NAYO Foods
                </h3>
                <p className="text-nayo-white/70 leading-relaxed max-w-md text-sm sm:text-base">
                  Authentic meals and catering, made fresh daily.
                </p>
                <div className="flex items-center gap-6 pt-2 pb-4">
                  <Link href="/food">
                    <button className="btn-gold px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm tracking-widest uppercase font-bold flex items-center gap-2">
                      Explore Foods
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Local Dishes", "Catering", "Fresh Juices"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full border border-nayo-green-light/30 text-[#4CAF50] text-xs font-semibold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image side */}
              <div className="relative h-72 lg:h-auto min-h-[320px] lg:min-h-[450px]">
                <Image
                  src="/hero-food.png"
                  alt="Nayo Foods"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Left fade for desktop */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E16] via-[#0F1E16]/20 to-transparent lg:block hidden" />
                {/* Top fade for mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F1E16] via-transparent to-transparent lg:hidden" />
                {/* Warm overlay */}
                <div className="absolute inset-0 bg-nayo-green-light/10 mix-blend-multiply" />
              </div>
            </div>
          </motion.div>

          {/* NAYO APPAREL CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden border border-nayo-green/30 w-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,30,22,0.9) 0%, rgba(10,20,15,0.95) 100%)",
            }}
          >
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-0">
              {/* Text side */}
              <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 lg:pr-8">
                <h3 className="text-display text-3xl sm:text-4xl xl:text-5xl font-bold text-nayo-white leading-tight">
                  NAYO Apparel
                </h3>
                <p className="text-nayo-white/70 leading-relaxed max-w-md text-sm sm:text-base">
                  Fashion and professional wear, crafted with intention.
                </p>
                <div className="flex items-center gap-6 pt-2 pb-4">
                  <Link href="/fashion">
                    <button className="btn-gold px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm tracking-widest uppercase font-bold flex items-center gap-2">
                      Explore Apparel
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Streetwear", "Corporate Wear", "Medical Uniforms"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full border border-nayo-white/10 text-nayo-white/80 text-xs font-semibold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image side */}
              <div className="relative h-72 lg:h-auto min-h-[320px] lg:min-h-[450px]">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&q=80"
                  alt="Nayo Apparel"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                {/* Left fade for desktop */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E16] via-[#0F1E16]/20 to-transparent lg:block hidden" />
                {/* Top fade for mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F1E16] via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
