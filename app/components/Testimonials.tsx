"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Kofi Mensah",
    role: "Accra",
    line: "Nayo Foods",
    quote:
      "I've had jollof from London to Lagos. Nayo's version made me call my mother. That's the highest compliment I know how to give.",
  },
  {
    name: "Nia Asante, RN",
    role: "Silver Spring",
    line: "Nayo Health",
    quote:
      "Twelve-hour shifts used to wreck my scrubs by week two. These still look sharp, and the fit actually lets me move.",
  },
  {
    name: "Ama Boateng",
    role: "Bowie",
    line: "Nayo Foods",
    quote:
      "The kenkey platter tasted like Sunday at my auntie's. We ordered for the whole table and nobody left anything.",
  },
  {
    name: "Kwame Owusu",
    role: "Gaithersburg",
    line: "Nayo Health",
    quote:
      "We outfitted our unit in the teal and burgundy sets. Patients notice. The team feels like a team.",
  },
  {
    name: "Efua Darko",
    role: "Hyattsville",
    line: "Nayo Foods",
    quote:
      "The ampesi with kontomire stew was the first plate that felt like home since we moved. Packed clean, still hot.",
  },
  {
    name: "Jennifer Clarke, CNA",
    role: "Baltimore",
    line: "Nayo Health",
    quote:
      "Comfortable enough for the floor, polished enough that I don't change before I run errands. That is rare.",
  },
  {
    name: "Yaw Addo",
    role: "College Park",
    line: "Nayo Foods",
    quote:
      "Ordered for a family gathering. Delivery was on time, the jollof was generous, and people asked for the name.",
  },
  {
    name: "Priscilla Mensah",
    role: "Rockville",
    line: "Nayo Health",
    quote:
      "I bought lanyards and scrubs for new staff. Everything arrived looking considered, not like leftover catalog stock.",
  },
];

function TestimonialCard({
  name,
  role,
  line,
  quote,
}: (typeof testimonials)[number]) {
  return (
    <article className="nayo-testimonial-card nayo-glass-card relative rounded-2xl px-5 py-5 sm:px-6 sm:py-6 flex flex-col overflow-hidden">
      <Quote
        size={28}
        className="absolute top-5 right-5 text-white/20"
        aria-hidden
      />
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className="fill-nayo-gold text-nayo-gold"
          />
        ))}
      </div>
      <p className="mt-4 pr-8 text-sm leading-relaxed text-white/90 flex-1 break-words">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-nayo-gold/50 to-transparent" />
      <p className="mt-4 text-sm font-semibold text-white">{name}</p>
      <p className="text-xs text-white/55">{role}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nayo-gold">
        {line}
      </p>
    </article>
  );
}

export default function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden bg-nayo-green py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
      <div className="relative">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center mb-8 sm:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-nayo-gold text-xs tracking-[0.3em] uppercase font-semibold"
          >
            What Our Customers Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3"
          >
            Loved by Those Who <span className="gold-text">Live It.</span>
          </motion.h2>
        </div>

        <div className="nayo-marquee relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 lg:w-28 bg-gradient-to-r from-nayo-green to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 lg:w-28 bg-gradient-to-l from-nayo-green to-transparent"
            aria-hidden
          />
          <div className="nayo-marquee-track">
            {loop.map((item, i) => (
              <TestimonialCard key={`${item.name}-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
