"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Adaeze Nwosu",
    role: "Fashion Stylist, Lagos",
    quote:
      "The Amber Silk Maxi stopped traffic at three separate events. Every single person asked 'where is that from?' I tell them Nayo. Every time.",
    rating: 5,
    productImage: "/hero-fashion.png",
    productName: "Amber Silk Maxi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  },
  {
    id: 2,
    name: "Kofi Mensah",
    role: "Food Blogger, Accra",
    quote:
      "I've had jollof from London to Lagos. Nayo's version made me call my mother. That's the highest compliment I know how to give.",
    rating: 5,
    productImage: "/hero-food.png",
    productName: "Jollof & Fried Chicken",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80",
  },
  {
    id: 3,
    name: "Miriam Osei",
    role: "Cultural Curator, London",
    quote:
      "The beaded necklace I purchased carries symbols from my grandmother's region. Wearing it isn't fashion — it's remembrance. Nayo gets it.",
    rating: 5,
    productImage: "https://images.unsplash.com/photo-1599643478524-fb66f72a500b?w=200&q=80",
    productName: "Heritage Necklace",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&q=80",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #111008 50%, #0A0A0A 100%)",
      }}
    >
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-px divider-gold" />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-nayo-gold text-xs tracking-[0.3em] uppercase font-semibold"
          >
            What Our Customers Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-display text-4xl sm:text-5xl font-bold text-nayo-white"
          >
            Loved by Those Who{" "}
            <span className="gold-text">Live It.</span>
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1],
                delay: 0.3 + i * 0.1,
              }}
              className="relative rounded-2xl overflow-hidden border border-nayo-gold/15 flex flex-col"
              style={{
                background:
                  "linear-gradient(135deg, rgba(25,20,5,0.9) 0%, rgba(15,12,3,0.95) 100%)",
              }}
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 opacity-10">
                <Quote size={40} className="text-nayo-gold" />
              </div>

              <div className="p-7 flex flex-col gap-5 flex-1">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="fill-nayo-gold text-nayo-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-nayo-white/70 leading-relaxed text-sm flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px divider-gold" />

                {/* Customer */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-nayo-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-nayo-white/40">{t.role}</p>
                </div>

                {/* Purchased badge */}
                <div className="text-[10px] text-nayo-gold/60 tracking-widest uppercase font-medium">
                  ✓ Purchased: {t.productName}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px divider-gold" />
    </section>
  );
}
