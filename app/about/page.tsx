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
  Crown,
  Award,
  ShieldCheck,
  Fingerprint,
  Users,
  HeartHandshake,
  Star,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import About from "@/app/components/About";
import Gallery from "@/app/components/Gallery";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const values = [
  { name: "Excellence", icon: Crown },
  { name: "Quality", icon: Award },
  { name: "Integrity", icon: ShieldCheck },
  { name: "Authenticity", icon: Fingerprint },
  { name: "Creativity", icon: Sparkles },
  { name: "Family", icon: Users },
  { name: "Community", icon: HeartHandshake },
  { name: "Customer Satisfaction", icon: Star },
];

const strategy = [
  "Build a strong and consistent brand identity.",
  "Dress staff in branded NAYO apparel.",
  "Showcase fashion and food through engaging social media content.",
  "Offer promotional bundles combining apparel and food purchases.",
  "Partner with influencers, healthcare professionals, and local businesses.",
  "Participate in community events, health fairs, markets, and festivals.",
  "Supply custom uniforms to hospitals, clinics, pharmacies, schools, and organizations.",
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
    <main className="relative bg-nayo-black min-h-screen selection:bg-nayo-gold/30 selection:text-nayo-white">
      <Navbar />

      <div className="pt-24">
        {/* The original requested About component with the woman in elegant dress and stats */}
        <About />

        {/* 2. VISION & MISSION */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Vision */}
            <motion.div
              {...fadeUp(0.1)}
              className="group glass-dark rounded-2xl p-10 sm:p-14 border border-nayo-gold/10 hover:border-nayo-gold/40 hover:bg-nayo-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(212,175,55,0.15)] flex flex-col justify-center"
            >
              <div className="w-8 h-1 bg-nayo-gold/40 group-hover:bg-nayo-gold transition-colors duration-500 mb-8 rounded-full" />
              <h3 className="text-xs tracking-[0.3em] uppercase font-semibold text-nayo-gold mb-4">
                Brand Vision
              </h3>
              <p className="text-display text-xl sm:text-2xl font-bold text-nayo-white leading-snug">
                To become a trusted lifestyle brand recognized for delivering quality fashion, professional apparel, and exceptional food experiences that enrich everyday life.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              {...fadeUp(0.3)}
              className="group glass-dark rounded-2xl p-10 sm:p-14 border border-nayo-gold/10 hover:border-nayo-gold/40 hover:bg-nayo-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(212,175,55,0.15)] flex flex-col justify-center"
            >
              <div className="w-8 h-1 bg-nayo-gold/40 group-hover:bg-nayo-gold transition-colors duration-500 mb-8 rounded-full" />
              <h3 className="text-xs tracking-[0.3em] uppercase font-semibold text-nayo-gold mb-4">
                Brand Mission
              </h3>
              <p className="text-display text-xl sm:text-2xl font-bold text-nayo-white leading-snug">
                To provide stylish clothing, professional uniforms, and delicious food that inspire confidence, celebrate culture, and bring people together through outstanding quality and service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. CORE VALUES */}
        <section className="py-20 sm:py-32 px-6 lg:px-10 overflow-hidden relative border-t border-nayo-white/5">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.h2
                {...fadeUp(0.1)}
                className="text-display text-3xl sm:text-4xl font-bold leading-tight mb-4 text-nayo-white"
              >
                Our Core <span className="gold-text">Values</span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {values.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                    className="group relative bg-nayo-white/[0.02] border border-nayo-gold/10 hover:border-nayo-gold/30 hover:bg-nayo-white/[0.04] transition-all duration-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.2)]"
                  >
                    <Icon size={32} className="text-nayo-gold/70 group-hover:text-nayo-gold transition-colors duration-500 mb-4" strokeWidth={1.5} />
                    <h3 className="text-display text-lg sm:text-xl font-bold text-[#F5F1E8]">
                      {val.name}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. MARKETING STRATEGY */}
        <section className="py-20 sm:py-32 px-6 lg:px-10 overflow-hidden relative border-t border-nayo-white/5">
          <div className="max-w-[1000px] mx-auto">
            <motion.div {...fadeUp(0.1)} className="mb-12 text-center">
              <h2 className="text-xs tracking-[0.3em] uppercase font-semibold text-nayo-gold mb-4">
                The Blueprint
              </h2>
              <h3 className="text-display text-3xl sm:text-4xl font-bold text-nayo-white">
                Marketing <span className="gold-text">Strategy</span>
              </h3>
            </motion.div>

            <motion.div 
              {...fadeUp(0.2)}
              className="glass-dark rounded-3xl p-8 sm:p-12 lg:p-16 border border-nayo-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]"
            >
              <ul className="space-y-6 sm:space-y-8">
                {strategy.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-nayo-gold/10 flex items-center justify-center shrink-0 border border-nayo-gold/30 group-hover:bg-nayo-gold/20 group-hover:border-nayo-gold/50 transition-colors duration-300">
                      <CheckCircle2 size={14} className="text-nayo-gold" />
                    </div>
                    <p className="text-nayo-white/80 text-base sm:text-lg leading-relaxed group-hover:text-nayo-white transition-colors duration-300">
                      {item}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 5. FUTURE GROWTH */}
        <section className="py-24 sm:py-32 px-6 lg:px-10 overflow-hidden relative border-t border-nayo-white/5">
          <div className="max-w-[1400px] mx-auto mb-16 text-center">
            <motion.h2
              {...fadeUp(0.1)}
              className="text-display text-3xl sm:text-4xl font-bold text-nayo-white mb-4"
            >
              Future <span className="gold-text">Growth</span>
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="text-nayo-white/50 text-lg max-w-2xl mx-auto"
            >
              NAYO aims to expand into multiple dedicated divisions.
            </motion.p>
          </div>

          {/* Scrollable Chips Row */}
          <div className="w-full relative max-w-[1400px] mx-auto">
            {/* Gradient masks for smooth scrolling edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-nayo-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-nayo-black to-transparent z-10 pointer-events-none" />

            <motion.div 
              {...fadeUp(0.3)}
              className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 pt-4 px-4 sm:px-12 hide-scrollbar snap-x"
            >
              {roadmap.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="snap-center shrink-0 flex items-center gap-3 glass-dark border border-nayo-gold/10 px-6 sm:px-8 py-4 sm:py-5 rounded-full hover:border-nayo-gold/40 hover:bg-nayo-white/[0.05] hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.2)] transition-all duration-300 cursor-default group"
                  >
                    <Icon size={18} className="text-nayo-gold/60 group-hover:text-nayo-gold transition-colors duration-300" />
                    <span className="text-nayo-white/80 font-medium tracking-wide whitespace-nowrap group-hover:text-nayo-white transition-colors duration-300">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* 6. OUR PROMISE */}
        <section className="relative py-32 sm:py-48 px-6 lg:px-10 flex items-center justify-center border-t border-nayo-gold/10">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(212,175,55,0.05) 0%, transparent 60%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            <h2 className="text-xs tracking-[0.3em] uppercase font-semibold text-nayo-gold mb-10">
              Our Promise
            </h2>
            <p className="text-display text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed text-nayo-white/90">
              At NAYO, we are committed to <span className="gold-text italic">excellence</span> in everything we do. Whether through stylish apparel, professional healthcare uniforms, or delicious meals, we strive to deliver products and services that inspire <span className="gold-text italic">confidence</span>, celebrate <span className="gold-text italic">culture</span>, and exceed expectations.
            </p>
          </motion.div>
        </section>
      </div>

      <Footer />
      <CartDrawer />
    </main>
  );
}
