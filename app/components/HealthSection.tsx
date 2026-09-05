"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionClose from "./SectionClose";
import { healthProducts } from "@/app/data/products";

const SLIDE_MS = 5000;

const lookbook = [
  {
    src: "/health-team-group.jpg",
    alt: "Nayo Health team in colorful scrubs",
    caption: "The full color story",
  },
  {
    src: "/health-scrub-charcoal.jpg",
    alt: "Charcoal jogger scrubs",
    caption: "Charcoal signature scrubs",
  },
  {
    src: "/health-scrub-sage.jpg",
    alt: "Sage clinical scrubs",
    caption: "Sage clinical set",
  },
  {
    src: "/health-duo-teal-burgundy.jpg",
    alt: "Teal and burgundy cargo scrubs",
    caption: "Teal and burgundy cargo",
  },
  {
    src: "/health-scrub-sky.jpg",
    alt: "Sky blue shift scrubs",
    caption: "Sky blue shift set",
  },
  {
    src: "/health-nurse-lanyard.jpg",
    alt: "Nursing student lanyard and badge",
    caption: "Nursing student lanyard",
  },
];

export default function HealthSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const startRef = useRef<number | null>(null);
  const ring = 2 * Math.PI * 22;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(desktop.matches);
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

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
        setCurrent((prev) => (prev + 1) % lookbook.length);
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

  const peek = isDesktop ? "38vw" : "70vw";

  return (
    <section id="health" className="relative bg-nayo-white">
      <div className="relative bg-nayo-green overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />

        <div className="relative overflow-hidden h-[min(78vh,720px)] min-h-[520px] sm:h-[min(76vh,740px)] lg:h-[min(80vh,780px)]">
          {lookbook.map((slide, i) => {
            const length = lookbook.length;
            const offset = (i - current + length) % length;
            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === length - 1;
            const isVisible = isActive || isNext || isPrev;
            const scale = isActive ? 1 : 0.86;

            return (
              <motion.div
                key={slide.src}
                onClick={() => {
                  if (!isActive) goTo(i);
                }}
                animate={{
                  x: isActive
                    ? "-50%"
                    : isNext
                      ? `calc(-50% + ${peek})`
                      : `calc(-50% - ${peek})`,
                  y: "-50%",
                  scale,
                  opacity: isActive ? 1 : isVisible ? 0.62 : 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute left-1/2 top-1/2 w-[86vw] sm:w-[min(64vw,480px)] lg:w-[520px] h-[90%] max-h-[640px] lg:h-[660px] ${
                  isActive
                    ? "z-20"
                    : isVisible
                      ? "z-10 cursor-pointer"
                      : "z-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <div className="relative h-full w-full rounded-[24px] overflow-hidden bg-nayo-green border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.28)] flex flex-col">
                  <div className="relative flex-1 min-h-0 mx-2.5 mt-3 mb-2 sm:mx-3 sm:mt-4 sm:mb-3 rounded-xl sm:rounded-2xl bg-nayo-green overflow-hidden">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      quality={95}
                      className="object-contain object-top"
                      sizes="(max-width: 640px) 86vw, 520px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nayo-green via-nayo-green/35 to-nayo-green/15 pointer-events-none" />
                  </div>

                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 pointer-events-none">
                    <svg
                      viewBox="0 0 56 56"
                      className="w-full h-full -rotate-90"
                    >
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
                        strokeDashoffset={
                          ring *
                          (1 - (isActive ? progress : i < current ? 1 : 0))
                        }
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="relative px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                    <p className="text-white text-sm sm:text-base font-medium leading-snug">
                      {slide.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative flex items-center gap-3 px-4 sm:px-10 lg:px-16 py-4 sm:py-5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-nayo-black flex items-center justify-center shrink-0"
            aria-label={paused ? "Play carousel" : "Pause carousel"}
          >
            {paused ? (
              <Play size={16} fill="currentColor" />
            ) : (
              <Pause size={16} fill="currentColor" />
            )}
          </button>
          <div className="flex-1 flex items-center gap-1.5">
            {lookbook.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                className="relative h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden"
                aria-label={`Show ${slide.caption}`}
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

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pb-10 sm:pb-12">
          <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold mb-3">
            Nayo Health
          </p>
          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
            Crafted For Every Shift.
          </h1>
          <p className="mt-4 text-white/80 max-w-lg text-sm sm:text-base">
            Modern scrubs and small essentials with a tailored fit, built for
            long hours and a confident presence on the floor.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            Shop the <span className="gold-text">collection</span>
          </h2>
          <p className="mt-3 text-nayo-black/55 max-w-xl">
            Scrubs and lanyards that work as hard as you do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              imageFit="contain"
            />
          ))}
        </div>
      </div>

      <SectionClose
        eyebrow="Nayo Health"
        title="Show up looking like you belong."
        body="Every shift is a promise. Dress for the work, the team, and the people who trust you with their care."
        href="/contact"
        cta="Talk to us"
      />
    </section>
  );
}
