"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";

const heroSlides = [
  {
    label: "Fashion",
    image: "/hero-fashion.png",
    accent: "#D4AF37",
  },
  {
    label: "Food",
    image: "/hero-food.png",
    accent: "#F5C24D",
  },
  {
    label: "Workwear",
    image: "/hero-scrubs.png",
    accent: "#D4AF37",
  },
];

const avatarColors = ["#D4AF37", "#F5C24D", "#C9A227", "#E8B84B"];

// Helper to create staggered fade-up motion props
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" as any, delay },
  };
}


export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % heroSlides.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100dvh] bg-nayo-black flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-8">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(245,194,77,0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Removed Centered Logo */}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center w-full min-h-[calc(100vh-80px)] mt-12 sm:mt-8 lg:mt-0">
        {/* Left: Text Content */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 flex flex-col justify-center h-full pt-8 lg:pt-0">

          {/* Headline */}
          <div className="space-y-0.5 sm:space-y-1">
            {["WEAR IT.", "TASTE IT."].map((line, i) => (
              <motion.h1
                key={line}
                {...fadeUp(0.2 + i * 0.1)}
                className="text-display text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight tracking-tight text-nayo-white"
              >
                {line}
              </motion.h1>
            ))}
            <motion.p
              {...fadeUp(0.4)}
              className="text-display text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-bold leading-tight tracking-tight gold-text"
            >
              LOVE IT.
            </motion.p>
          </div>

          {/* Supporting copy */}
          <motion.p
            {...fadeUp(0.5)}
            className="text-nayo-white/70 text-sm sm:text-base lg:text-base leading-relaxed max-w-md hidden sm:block"
          >
            Fashion that tells your story. Food that feeds your soul. Culture
            that grounds your identity. Welcome to Nayo.
          </motion.p>

          <motion.div
            {...fadeUp(0.6)}
            className="flex flex-wrap gap-2 sm:gap-4 pt-2"
          >
            <Link
              href="/fashion"
              className="btn-gold flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs tracking-widest uppercase font-bold"
            >
              Explore Shop
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="btn-outline flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs tracking-widest uppercase font-medium"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            {...fadeUp(0.7)}
            className="flex items-center gap-4 pt-4"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-3">
              {avatarColors.map((color, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-nayo-black flex items-center justify-center text-xs font-bold text-nayo-ink"
                  style={{ background: `linear-gradient(135deg, ${color}, #F5C24D)` }}
                >
                  {["A", "K", "M", "T"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-nayo-gold text-nayo-gold"
                  />
                ))}
                <span className="text-sm font-semibold text-nayo-white ml-1">4.9</span>
              </div>
              <p className="text-xs text-nayo-white/50 mt-0.5">
                5,000+ happy customers
              </p>
            </div>
          </motion.div>
        </div>


        {/* Right: Rotating Product Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" as any, delay: 0.3 }}
          className="relative flex items-center justify-center h-full max-h-[220px] sm:max-h-[300px] lg:max-h-[500px] w-full mt-10 sm:mt-12 lg:mt-0"
        >
          {/* Category tabs */}
          <div className="absolute -top-8 sm:-top-10 lg:-top-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.label}
                onClick={() => setCurrent(i)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                  current === i
                    ? "gold-gradient text-nayo-ink"
                    : "glass-light border border-nayo-gold/20 text-nayo-white/50 hover:text-nayo-white"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>

          {/* Stacked image cards */}
          <div className="relative w-44 sm:w-72 lg:w-[320px] h-60 sm:h-[320px] lg:h-[440px] mt-16 sm:mt-16 lg:mt-0">
            {heroSlides.map((slide, i) => {
              const offset = (i - current + heroSlides.length) % heroSlides.length;
              return (
                <motion.div
                  key={slide.image}
                  animate={{
                    scale: offset === 0 ? 1 : offset === 1 ? 0.9 : 0.8,
                    rotate: offset === 0 ? 0 : offset === 1 ? 6 : -6,
                    x: offset === 0 ? 0 : offset === 1 ? 30 : -30,
                    y: offset === 0 ? 0 : 20,
                    zIndex: offset === 0 ? 3 : offset === 1 ? 2 : 1,
                    opacity: offset === 0 ? 1 : offset === 1 ? 0.6 : 0.3,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" as any }}
                  style={{ position: "absolute", inset: 0 }}
                  className="cursor-pointer"
                  onClick={() => setCurrent(i)}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-nayo-gold/20 shadow-2xl">
                    <Image
                      src={slide.image}
                      alt={slide.label}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-nayo-ink/60 via-transparent to-transparent" />
                    {/* Label */}
                    {offset === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
                      >
                        <span className="text-sm font-bold tracking-widest uppercase gold-text text-display">
                          {slide.label}
                        </span>
                        <span className="text-xs text-white/70 tracking-wider">
                          Shop →
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Decorative elements */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }}
          />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nayo-cream to-transparent pointer-events-none" />
    </section>
  );
}
