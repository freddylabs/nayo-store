"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Fingerprint,
  Users,
  HeartHandshake,
} from "lucide-react";

const values = [
  {
    title: "Family",
    icon: Users,
    copy: "You don't just shop with us; you sit at our table.",
  },
  {
    title: "Excellence",
    icon: Crown,
    copy: "We do not know how to settle. We only know how to lead.",
  },
  {
    title: "Authenticity",
    icon: Fingerprint,
    copy: "Unfiltered, unapologetic, and fiercely true to our roots.",
  },
  {
    title: "Community",
    icon: HeartHandshake,
    copy: "Our foundation is built by the people who stand with us.",
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, delay, ease: "easeOut" as any },
});

export default function LegacySection() {
  return (
    <section className="relative bg-nayo-black py-16 sm:py-20 overflow-hidden border-t border-nayo-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 relative z-10 flex flex-col items-center">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-nayo-white"
          >
            Every Nayo creation holds what money cannot buy — <span className="gold-text italic">a bloodline, a promise.</span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="text-nayo-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          >
            Born from generations of uncompromising standards, our foundation was laid long before the doors ever opened.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 w-full mb-24 mt-4">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" as any }}
                className="group relative bg-nayo-white/[0.02] border border-nayo-gold/10 hover:border-nayo-gold/30 hover:bg-nayo-white/[0.04] transition-all duration-500 rounded-2xl p-8 sm:p-10 flex flex-col items-start hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.2)]"
              >
                <div className="mb-6 flex flex-col items-start">
                  <Icon size={28} className="text-nayo-gold/70 group-hover:text-nayo-gold transition-colors duration-500 mb-4" strokeWidth={1.5} />
                  <div className="w-8 h-[2px] bg-nayo-gold/40 group-hover:bg-nayo-gold transition-colors duration-500 rounded-full" />
                </div>
                
                <h3 className="text-display text-2xl font-bold text-nayo-white mb-3">
                  {item.title}
                </h3>
                
                <p className="text-nayo-white/70 text-sm leading-relaxed font-medium">
                  {item.copy}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Outro */}
        <motion.div
          {...fadeUp(0.8)}
          className="text-center"
        >
          <p className="text-display text-xl sm:text-2xl font-bold text-nayo-white/80">
            This is the legacy you wear, the culture you taste, <span className="gold-text italic">the family you love.</span>
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}
