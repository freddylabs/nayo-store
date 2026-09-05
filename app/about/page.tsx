"use client";

import { motion } from "framer-motion";
import {
  Coffee,
  Store,
  UtensilsCrossed,
  Baby,
  Home as HomeIcon,
  Sparkles,
  Stethoscope,
  PartyPopper,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SectionClose from "@/app/components/SectionClose";
import ExploreShop from "@/app/components/ExploreShop";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const values = [
  {
    n: "01",
    name: "Excellence",
    line: "Every cut, plate, and uniform held to the highest standard.",
  },
  {
    n: "02",
    name: "Quality",
    line: "Materials, craft, and flavor you can trust, every time.",
  },
  {
    n: "03",
    name: "Integrity",
    line: "Honest work, honest service, and a name we protect.",
  },
  {
    n: "04",
    name: "Authenticity",
    line: "Heritage in the cloth and in the kitchen — never a costume.",
  },
  {
    n: "05",
    name: "Creativity",
    line: "New silhouettes and flavors, always with intention.",
  },
  {
    n: "06",
    name: "Family",
    line: "We were built on family, and we still run that way.",
  },
  {
    n: "07",
    name: "Community",
    line: "We grow with the people we dress, feed, and serve.",
  },
  {
    n: "08",
    name: "Customer Satisfaction",
    line: "We only offer products we are proud to stand behind.",
  },
];

const roadmap = [
  { name: "NAYO Café", icon: Coffee },
  { name: "NAYO Boutique", icon: Store },
  { name: "NAYO Catering", icon: UtensilsCrossed },
  { name: "NAYO Kids", icon: Baby },
  { name: "NAYO Home", icon: HomeIcon },
  { name: "NAYO Fragrance", icon: Sparkles },
  { name: "NAYO Medical Uniforms", icon: Stethoscope },
  { name: "NAYO Events", icon: PartyPopper },
];

export default function AboutPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />

      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="max-w-[1400px] mx-auto section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <motion.div {...fadeUp(0.05)} className="lg:col-span-7">
              <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                Our story
              </p>
              <h1 className="text-display text-3xl sm:text-5xl font-bold text-nayo-black mt-3 leading-tight">
                A legacy of family, excellence, and care.
              </h1>
              <div className="mt-6 space-y-4 text-nayo-black/65 leading-relaxed max-w-xl">
                <p>
                  NAYO was founded with a vision to create more than just a
                  business — it was created to build a legacy. Rooted in strong
                  family values and a passion for excellence, NAYO brings
                  together two everyday essentials: quality fashion and great
                  food under one trusted brand.
                </p>
                <p>
                  We believe that what people wear and what they eat should
                  reflect confidence, quality, and care. Every product and
                  service we offer is designed to enrich lives, celebrate
                  culture, and create meaningful experiences for our customers.
                </p>
                <p>
                  As we grow, our commitment remains the same: to deliver
                  exceptional products, outstanding service, and lasting value
                  while making a positive impact in the communities we serve.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.12)}
              className="lg:col-span-5 flex flex-col justify-center gap-10 lg:pl-8 lg:border-l lg:border-nayo-gold/30"
            >
              <div>
                <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                  Vision
                </p>
                <p className="mt-4 text-display text-2xl sm:text-3xl font-semibold text-nayo-black leading-snug">
                  To become a trusted lifestyle brand recognized for delivering
                  quality fashion, professional apparel, and exceptional food
                  experiences that enrich everyday life.
                </p>
              </div>
              <div className="h-px w-16 bg-nayo-gold/50" />
              <div>
                <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                  Mission
                </p>
                <p className="mt-4 text-nayo-black/70 leading-relaxed">
                  To provide stylish clothing, professional uniforms, and
                  delicious food that inspire confidence, celebrate culture, and
                  bring people together through outstanding quality and service.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#F7F4EE] border-y border-nayo-green/10">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
            <motion.div {...fadeUp(0.05)} className="max-w-2xl mb-12 sm:mb-16">
              <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                How we work
              </p>
              <h2 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black mt-3">
                Our core values
              </h2>
              <p className="mt-3 text-nayo-black/55">
                The standards we cut, cook, and serve by.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-20">
              {values.map((val, i) => (
                <motion.div
                  key={val.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="flex gap-5 py-6 border-t border-nayo-green/10"
                >
                  <span className="text-nayo-gold text-xs tracking-[0.2em] font-semibold pt-1 shrink-0">
                    {val.n}
                  </span>
                  <div>
                    <h3 className="text-display text-xl sm:text-2xl font-bold text-nayo-black">
                      {val.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-nayo-black/55 leading-relaxed">
                      {val.line}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-nayo-green">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
            <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
              What&apos;s next
            </p>
            <h2 className="text-display text-3xl sm:text-4xl font-bold text-white mt-3">
              Future growth
            </h2>
            <p className="mt-3 text-white/70 max-w-xl">
              NAYO aims to grow into new collections and services, while staying
              one trusted brand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {roadmap.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/90"
                  >
                    <Icon size={14} className="text-nayo-gold" />
                    {item.name}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <div className="bg-nayo-white py-14 sm:py-16">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <ExploreShop />
          </div>
        </div>

        <SectionClose
          eyebrow="Nayo"
          title="Live the NAYO Lifestyle."
          body="Shop our apparel, food, and health collections, or get in touch if you need something specific."
          href="/contact"
          cta="Get in touch"
        />
      </div>

      <Footer />
    </main>
  );
}
