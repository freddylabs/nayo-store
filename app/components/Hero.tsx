"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import ExploreShop from "./ExploreShop";
import BrandStory from "./BrandStory";
import { defaultCopy, type SiteCopy } from "@/app/lib/site-data";

const SLIDE_MS = 5500;

const heroSlides = [
  {
    label: "Food",
    brand: "Nayo Foods",
    title: "Taste What Feeds The Soul",
    href: "/food",
    cta: "Explore Foods",
    images: [
      {
        src: "/hero-food.png",
        caption: "Jollof and beef",
      },
      {
        src: "/food-ampesi-plantain.jpg",
        caption: "Plantain Ampesi, grilled fish & eggs",
      },
      {
        src: "/food-ampesi-kontomire.jpg",
        caption: "Yam, plantain & kontomire stew",
      },
    ],
  },
  {
    label: "Apparel",
    brand: "Nayo Apparel",
    title: "Wear What Speaks For You",
    href: "/fashion",
    cta: "Shop Fashion",
    images: [
      {
        src: "/apparel-royal-gown.jpg",
        caption: "Royal blue embroidered mermaid gown",
      },
      {
        src: "/fashion-blazer.png",
        caption: "Onyx blazer with gold trim",
      },
      {
        src: "/fashion-velvet.png",
        caption: "Velvet evening gown",
      },
    ],
  },
  {
    label: "Health",
    brand: "Nayo Health",
    title: "Crafted For Every Shift",
    href: "/health",
    cta: "Shop Health",
    images: [
      {
        type: "video" as const,
        src: "/health-professionals.mp4",
        caption: "Crafted For Every Shift",
      },
      {
        src: "/health-team-group.jpg",
        caption: "Uniforms made for every shift",
      },
      {
        src: "/health-duo-teal-burgundy.jpg",
        caption: "Made for the floor",
      },
    ],
  },
];

export default function Hero({ copy = defaultCopy }: { copy?: SiteCopy }) {
  const [current, setCurrent] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeMedia = heroSlides[current].images[photo];
  const activeIsVideo = activeMedia?.type === "video";

  const goNext = () => {
    const total = heroSlides[current].images.length;
    if (photo + 1 < total) {
      setPhoto(photo + 1);
    } else {
      setCurrent((prevCard) => (prevCard + 1) % heroSlides.length);
      setPhoto(0);
    }
    setProgress(0);
    startRef.current = null;
  };

  useEffect(() => {
    startRef.current = null;
    setProgress(0);
  }, [current, photo]);

  useEffect(() => {
    if (paused || activeIsVideo) return;

    let frame = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const next = Math.min(elapsed / SLIDE_MS, 1);
      setProgress(next);
      if (next >= 1) {
        goNext();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, current, photo, activeIsVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!activeIsVideo || !video) return;

    video.currentTime = 0;
    if (!paused) video.play().catch(() => {});
    return () => {
      video.pause();
    };
  }, [activeIsVideo, current, photo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!activeIsVideo || !video) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused, activeIsVideo]);

  const goToCard = (index: number) => {
    setCurrent(index);
    setPhoto(0);
    setProgress(0);
    startRef.current = null;
  };

  const goToPhoto = (index: number) => {
    setPhoto(index);
    setProgress(0);
    startRef.current = null;
  };

  const ring = 2 * Math.PI * 22;
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(desktop.matches);
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative bg-nayo-green">
      <div className="pt-[5.75rem] sm:pt-[6.5rem] max-sm:h-[100dvh] max-sm:flex max-sm:flex-col">
        <div className="relative overflow-hidden max-sm:flex-1 max-sm:min-h-0 sm:h-[min(64vh,620px)] lg:h-[min(78vh,780px)]">
          {heroSlides.map((slide, i) => {
            const length = heroSlides.length;
            const offset = (i - current + length) % length;
            const isActive = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === length - 1;
            const isVisible = isDesktop && (isActive || isNext || isPrev);
            const scale = isActive ? 1 : 0.9;
            const shownPhoto = isActive ? photo : 0;
            const shownImage = slide.images[shownPhoto] ?? slide.images[0];
            const innerCount = slide.images.length;
            const ringFill = isActive
              ? (photo + progress) / innerCount
              : i < current
                ? 1
                : 0;

            return (
              <motion.div
                key={slide.label}
                onClick={() => {
                  if (!isActive) goToCard(i);
                }}
                animate={{
                  x: isActive
                    ? "-50%"
                    : isNext
                      ? "calc(-50% + 34vw)"
                      : "calc(-50% - 34vw)",
                  y: "-50%",
                  scale,
                  opacity: isActive ? 1 : isVisible ? 0.7 : 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute left-1/2 top-1/2 w-[94vw] max-sm:h-[98%] sm:w-[min(72vw,480px)] lg:w-[560px] sm:h-[min(54vh,520px)] lg:h-[640px] ${
                  isActive
                    ? "z-20"
                    : isVisible
                      ? "z-10 cursor-pointer"
                      : "z-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <div className="h-full w-full rounded-[22px] lg:rounded-[28px] bg-black/25 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden">
                  <div className="flex items-start justify-between gap-3 px-3 pt-3 pb-2 lg:px-5 lg:pt-5 lg:pb-3">
                    <span className="px-2.5 py-1 lg:px-3 rounded-md gold-gradient text-[9px] lg:text-[10px] font-bold tracking-[0.2em] uppercase text-nayo-black">
                      {slide.label}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="relative w-10 h-10 lg:w-12 lg:h-12 pointer-events-none shrink-0">
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
                            strokeDashoffset={ring * (1 - ringFill)}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] lg:text-[11px] font-bold text-white">
                          {String(
                            isActive ? shownPhoto + 1 : innerCount
                          ).padStart(2, "0")}
                        </span>
                      </div>
                      {innerCount > 1 && isActive && (
                        <div className="w-10 lg:w-12 flex flex-col gap-1">
                          {slide.images.map((image, pi) => (
                            <button
                              key={image.src}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                goToPhoto(pi);
                              }}
                              className="relative h-1 w-full rounded-full bg-white/30 overflow-hidden"
                              aria-label={`Show ${image.caption}`}
                            >
                              <span
                                className="absolute inset-y-0 left-0 rounded-full bg-nayo-gold"
                                style={{
                                  width:
                                    pi < photo
                                      ? "100%"
                                      : pi === photo
                                        ? `${progress * 100}%`
                                        : "0%",
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex-1 mx-2 sm:mx-3 lg:mx-5 min-h-0 rounded-xl lg:rounded-2xl bg-nayo-green/80 overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={shownImage.src}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="absolute inset-1 sm:inset-3 lg:inset-4"
                      >
                        {shownImage.type === "video" ? (
                          <video
                            ref={isActive ? videoRef : undefined}
                            src={shownImage.src}
                            muted
                            playsInline
                            preload="auto"
                            className="absolute inset-0 h-full w-full object-contain object-center"
                            onEnded={() => {
                              if (isActive) goNext();
                            }}
                            onTimeUpdate={(event) => {
                              if (!isActive) return;
                              const video = event.currentTarget;
                              if (video.duration > 0) {
                                setProgress(video.currentTime / video.duration);
                              }
                            }}
                          />
                        ) : (
                          <Image
                            src={shownImage.src}
                            alt={shownImage.caption}
                            fill
                            unoptimized
                            quality={100}
                            className={
                              slide.label === "Health"
                                ? "object-contain object-top"
                                : "object-contain object-center"
                            }
                            sizes="(max-width: 640px) 94vw, (max-width: 1024px) 58vw, 560px"
                            priority={i === 0}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="px-3 pt-2 pb-2.5 lg:px-5 lg:pt-4 lg:pb-5">
                    <h2 className="text-display text-xl sm:text-2xl lg:text-4xl font-bold text-white leading-tight">
                      {slide.brand}
                    </h2>
                    <p className="mt-0.5 text-white/75 text-xs sm:text-sm lg:text-base leading-snug line-clamp-1 lg:line-clamp-2">
                      {isActive ? shownImage.caption : slide.title}
                    </p>
                    <Link
                      href={slide.href}
                      className="mt-1.5 lg:mt-3 inline-flex items-center gap-2 text-white/90 text-xs sm:text-sm tracking-wide hover:text-nayo-gold transition-colors"
                    >
                      <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border border-white/70 flex items-center justify-center">
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

        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-10 lg:px-16 py-3 sm:py-5 lg:py-6 max-sm:shrink-0">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white text-nayo-black flex items-center justify-center shrink-0"
            aria-label={paused ? "Play carousel" : "Pause carousel"}
          >
            {paused ? (
              <Play size={18} fill="currentColor" />
            ) : (
              <Pause size={18} fill="currentColor" />
            )}
          </button>

          <div className="flex-1 flex items-center gap-2">
            {heroSlides.map((slide, i) => {
              const total = slide.images.length;
              const fill =
                i < current
                  ? 100
                  : i === current
                    ? ((photo + progress) / total) * 100
                    : 0;

              return (
                <button
                  key={slide.label}
                  type="button"
                  onClick={() => goToCard(i)}
                  className="relative h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden"
                  aria-label={`Go to ${slide.brand}`}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-nayo-gold"
                    style={{ width: `${fill}%` }}
                  />
                </button>
              );
            })}
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
          {copy.landingHeadline.split(/(TASTE IT\.)/i).map((part, i) =>
            /taste it\./i.test(part) ? (
              <span key={i} className="gold-text">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" as any }}
          className="mt-5 text-nayo-black/60 max-w-xl mx-auto text-base sm:text-lg"
        >
          {copy.landingSubtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" as any }}
          className="mt-8 flex flex-col items-center gap-6"
        >
          <ExploreShop />
          <Link
            href="/about"
            className="btn-outline flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-medium"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
      <BrandStory copy={copy} />
    </section>
  );
}
