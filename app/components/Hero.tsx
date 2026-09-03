"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";

const SLIDE_MS = 5500;

const heroSlides = [
  {
    label: "Fashion",
    title: "Wear What Speaks For You",
    href: "/fashion",
    cta: "Shop Fashion",
    image: "/hero-fashion.png",
  },
  {
    label: "Food",
    title: "Taste What Feeds The Soul",
    href: "/food",
    cta: "Explore Foods",
    image: "/hero-food.png",
  },
  {
    label: "Workwear",
    title: "Crafted For Every Shift",
    href: "/fashion",
    cta: "Shop Apparel",
    image: "/hero-scrubs.png",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    setProgress(0);
  }, [current]);

  useEffect(() => {
    if (paused) return;

    let frame = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const next = Math.min(elapsed / SLIDE_MS, 1);
      setProgress(next);
      if (next >= 1) {
        setCurrent((prev) => (prev + 1) % heroSlides.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, current]);

  const goTo = (index: number) => {
    setCurrent(index);
    setProgress(0);
    startRef.current = null;
  };

  const ring = 2 * Math.PI * 22;

  return (
    <section className="relative bg-nayo-green">
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <div className="relative h-[min(72vh,760px)] min-h-[380px] sm:min-h-[480px] overflow-hidden">
          {heroSlides.map((slide, i) => {
            const offset =
              (i - current + heroSlides.length) % heroSlides.length;
            const isActive = offset === 0;
            const scale = isActive ? 1 : 0.88;

            return (
              <motion.div
                key={slide.image}
                onClick={() => {
                  if (!isActive) goTo(i);
                }}
                animate={{
                  x:
                    offset === 0
                      ? "-50%"
                      : offset === 1
                        ? "calc(-50% + 38vw)"
                        : "calc(-50% - 38vw)",
                  scale,
                  opacity: isActive ? 1 : 0.72,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute top-[4%] bottom-[18%] left-1/2 w-[86vw] sm:w-[70vw] lg:w-[62vw] max-w-[980px] ${
                  isActive ? "z-20" : "z-10 cursor-pointer"
                }`}
                aria-hidden={!isActive}
              >
                <div className="relative h-full w-full rounded-[28px] overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 86vw, 70vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  <span className="absolute top-5 left-5 px-3 py-1 rounded-md gold-gradient text-[10px] font-bold tracking-[0.2em] uppercase text-nayo-black">
                    {slide.label}
                  </span>

                  {isActive && (
                    <div className="absolute top-5 right-5 w-14 h-14 pointer-events-none">
                      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={ring}
                          strokeDashoffset={ring * (1 - progress)}
                        />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <h2 className="text-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-xl">
                      {slide.title}
                    </h2>
                    <Link
                      href={slide.href}
                      className="mt-4 inline-flex items-center gap-2 text-white/90 text-sm tracking-wide hover:text-nayo-gold transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full border border-white/70 flex items-center justify-center">
                        <ArrowRight size={12} />
                      </span>
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-5 sm:px-10 lg:px-16 pb-6 sm:pb-8">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-nayo-black flex items-center justify-center shrink-0"
            aria-label={paused ? "Play carousel" : "Pause carousel"}
          >
            {paused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.label}
                type="button"
                onClick={() => goTo(i)}
                className="relative h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden"
                aria-label={`Go to ${slide.label}`}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-nayo-gold"
                  style={{
                    width:
                      i < current
                        ? "100%"
                        : i === current
                          ? `${progress * 100}%`
                          : "0%",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-nayo-white px-6 py-14 sm:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as any }}
          className="text-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-nayo-black"
        >
          WEAR IT.{" "}
          <span className="gold-text">TASTE IT.</span>{" "}
          LOVE IT.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" as any }}
          className="mt-5 text-nayo-black/60 max-w-xl mx-auto text-base sm:text-lg"
        >
          Fashion that tells your story. Food that feeds your soul. Culture
          that grounds your identity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" as any }}
          className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/fashion"
            className="btn-gold flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-bold"
          >
            Explore Shop
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/about"
            className="btn-outline flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-medium"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
